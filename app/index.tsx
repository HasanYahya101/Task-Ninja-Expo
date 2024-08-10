import * as React from 'react';
import { View, Dimensions, PanResponder } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { TouchableOpacity, ScrollView } from 'react-native';
import { Plus } from '~/lib/icons/Plus';
import { Star } from '~/lib/icons/Star';
import { Trash } from '~/lib/icons/Trash';
import { Text } from '~/components/ui/text';
import { useState, useRef, useEffect } from 'react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
import { Label } from '~/components/ui/label';
import { Switch } from '~/components/ui/switch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog';
import { Alert } from 'react-native';
import { Value } from '@rn-primitives/select';
import { Check } from 'lucide-react-native';
import { Checkbox } from '~/components/ui/checkbox';
import { Trash2Icon } from '~/lib/icons/Trash2Icon';
import { Keyboard } from 'react-native';

const { height } = Dimensions.get('window');
const DRAWER_HEIGHT = 498;

class Task {
	constructor(
		public description: string,
		public date: Date,
		public starred: boolean,
		public listName: string,
		public completed: boolean,
	) { }

	static fromJson(json: any): Task {
		return new Task(
			json.description,
			new Date(json.date),
			json.starred,
			json.listName
		);
	}
}

export default function Screen() {

	React.useEffect(() => {
		// set theme as light
		AsyncStorage.setItem('theme', 'light');
	}, []);

	const [activeTab, setActiveTab] = React.useState('My Tasks');
	const [tabLayouts, setTabLayouts] = React.useState({});
	const tabPosition = useSharedValue(0);
	const tabWidth = useSharedValue(0);
	const [isOpen, setIsOpen] = useState(false);
	const translateY = useSharedValue(DRAWER_HEIGHT);
	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		//bottom: insets.bottom + (insets.top * 3) + 10,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};
	const [tasks, setTasks] = useState([] as Task[]);
	const [Lists, setLists] = useState([] as string[]);

	const [starred, setStarred] = useState(false);
	const [selectedList, setSelectedList] = useState('My Tasks');

	const [dialogOpen, setDialogOpen] = useState(false);
	const [listInput, setListInput] = useState('');

	const [inputText, setInputText] = useState('');
	const [time, setTime] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);

	const isInitialMountTasks = useRef(true);
	const isInitialMountLists = useRef(true);

	/*const clearStorage = async () => {
		try {
			await AsyncStorage.clear();
			console.log('AsyncStorage cleared!');
		} catch (error) {
			console.error('Failed to clear AsyncStorage:', error);
		}
	};

	// clearStorage
	clearStorage();*/

	const loadData = async () => {
		const tasksData = await AsyncStorage.getItem('tasks');
		const listsData = await AsyncStorage.getItem('lists');
		if (tasksData) {
			setTasks(JSON.parse(tasksData).map((task: Task) => Task.fromJson(task)));
		}
		if (listsData) {
			setLists(JSON.parse(listsData));
		}
	}

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		if (isInitialMountTasks.current) {
			isInitialMountTasks.current = false;
		} else {
			AsyncStorage.setItem('tasks', JSON.stringify(tasks));
		}
	}, [tasks]);

	useEffect(() => {
		if (isInitialMountLists.current) {
			isInitialMountLists.current = false;
		} else {
			AsyncStorage.setItem('lists', JSON.stringify(Lists));
		}
	}, [Lists]);

	const addTask = () => {
		const newTask = new Task(inputText, time, starred, selectedList, false);
		// merge new task with existing tasks
		setTasks([...tasks, newTask]);
		// clear input fields
		setInputText('');
		setTime(new Date());
		setStarred(false);
		// close the keyboard if open
		Keyboard.dismiss();
		// close the drawer
		closeDrawer();
	};

	React.useEffect(() => {
		// Check if the tabLayouts has the current active tab
		if (tabLayouts[activeTab]) {
			tabPosition.value = withTiming(tabLayouts[activeTab].x, { duration: 300 });
			tabWidth.value = withTiming(tabLayouts[activeTab].width, { duration: 300 });
		}
	}, [tabLayouts, activeTab]);

	const handleTabPress = (tab) => {
		setActiveTab(tab);
		tabPosition.value = withTiming(tabLayouts[tab]?.x || 0);
		tabWidth.value = withTiming(tabLayouts[tab]?.width || 0);
	};

	const onLayoutTab = (tab) => (event) => {
		const { x, width } = event.nativeEvent.layout;
		setTabLayouts((prev) => ({ ...prev, [tab]: { x, width } }));
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: tabPosition.value }],
			width: tabWidth.value,
		};
	});

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (_, gestureState) => {
				if (gestureState.dy > 0) {
					translateY.value = gestureState.dy;
				}
			},
			onPanResponderRelease: (_, gestureState) => {
				if (gestureState.dy > DRAWER_HEIGHT / 3) {
					closeDrawer();
				} else {
					translateY.value = withSpring(0, {
						damping: 40,
						stiffness: 210,
					});
				}
			},
		})
	).current;

	const openDrawer = () => {
		setIsOpen(true);
		translateY.value = withSpring(0, {
			damping: 30,
			stiffness: 170,
		});
	};

	const closeDrawer = () => {
		setIsOpen(false);
		translateY.value = withSpring(DRAWER_HEIGHT, {
			damping: 20,
			stiffness: 170,
		});
	};

	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: translateY.value }],
		};
	});

	const onChange = (event, selectedTime) => {
		const currentTime = selectedTime || time;
		setShowPicker(false);
		setTime(currentTime);
	};

	const showTimePicker = () => {
		setShowPicker(true);
	};

	useEffect(() => {
		// when drawer closes, reset the input fields
		if (!isOpen) {
			setInputText('');
			setTime(new Date());
			setStarred(false);
			setSelectedList('My Tasks');
		}
	}, [isOpen]);

	const newListClicked = () => {
		// remove spaces from all sides
		const copyListInput = listInput.trim();
		if (copyListInput === 'My Tasks' || Lists.includes(copyListInput) || copyListInput === '' || copyListInput === 'Starred' || copyListInput.length > 20 || copyListInput.length < 5) {
			// show error message
			if (copyListInput === '') {
				Alert.alert('Error', 'List name cannot be empty.');
				return;
			}
			else if (copyListInput === 'Starred' || copyListInput.length > 20 || copyListInput.length < 5) {
				Alert.alert('Error', 'List name should be between 5 and 20 characters long.');
				return;
			}
			else if (copyListInput === 'My Tasks' || Lists.includes(copyListInput)) {
				Alert.alert('Error', 'List name already exists. Please enter a different name.');
				return;
			}
			setListInput('');
			return;
		}
		else {
			// add new list to the state
			setLists((prevLists) => [...prevLists, copyListInput]);
			//setSelectedList('My Tasks');
			setListInput('');
			setDialogOpen(false);
			return;
		}
	};

	const handlenewListClick = () => {
		if (Lists.length >= 10) {
			Alert.alert('Error', 'You can only have 10 custom lists. Please delete a list to add a new one.');
			return;
		}
		setDialogOpen(true);
	};

	const deleteList = (listName: string) => {
		// remove the list from the state
		setLists((prevLists) => prevLists.filter((list) => list !== listName));
		// remove all tasks from the list
		setTasks((prevTasks) => prevTasks.filter((task) => task.listName !== listName));
	};

	const [starredTasks, setStarredTasks] = useState([] as Task[]);

	useEffect(() => {
		// if tasks change filter and set starred tasks
		setStarredTasks(tasks.filter((task) => task.starred));
	}, [tasks]);

	return (
		<View className="z-10 flex-1 justify-start gap-0 p-0 bg-white dark:bg-black h-full">
			{/* Tabs */}
			<View className="flex-row border-b border-gray-400 mb-1.5 mx-0 mt-[28px] relative">
				<ScrollView horizontal className='flex-row' showsHorizontalScrollIndicator={false}
					style={{
						bottom: -1,
					}}
				>
					<TouchableOpacity
						className="ml-6 mr-4 flex-row items-center pb-2 relative mb-1.5"
						onPress={() => handleTabPress('Starred')}
						onLayout={onLayoutTab('Starred')}
					>
						<Star className={`w-4 h-4 ${activeTab === 'Starred' ? 'text-blue-500' : 'text-black dark:text-white'}`} />
					</TouchableOpacity>
					<TouchableOpacity
						className="ml-4 mr-4 flex-row items-center pb-2 relative mb-1.5"
						onPress={() => handleTabPress('My Tasks')}
						onLayout={onLayoutTab('My Tasks')}
					>
						<Text className={`text-[16px] ml-2 mr-2 ${activeTab === 'My Tasks' ? 'text-blue-500' : 'text-black dark:text-white'}`}>My Tasks</Text>
					</TouchableOpacity>
					{Lists.map((list, index) => (
						<TouchableOpacity key={index}
							className="ml-4 mr-4 flex-row items-center pb-2 relative mb-1.5"
							onPress={() => handleTabPress(list)}
							onLongPress={() => Alert.alert(
								`Delete List`,
								`Are you sure you want to delete this (${list}) list?.`,
								[
									{
										text: 'Cancel',
										onPress: () => console.log('Cancel Pressed'),
										style: 'cancel',
									},
									{
										text: 'Confirm',
										onPress: () => {
											deleteList(list);
											if (activeTab === list) {
												setActiveTab('My Tasks');
											}
										},
										style: 'destructive',
									},
								],
								{ cancelable: false }
							)}
							onLayout={onLayoutTab(list)}
						>
							<Text key={index} className={`text-[16px] ml-2 mr-2 ${activeTab === list ? 'text-blue-500' : 'text-black dark:text-white'}`}>
								{list}
							</Text>
						</TouchableOpacity>
					))
					}
					<TouchableOpacity
						className="ml-4 mr-6 flex-row items-center pb-2 relative mb-1.5"
						onPress={handlenewListClick}
					>
						<Plus className={`w-4 h-4 mr-2 ${activeTab === 'New list' ? 'text-blue-500' : 'text-black dark:text-white'}`} />
						<Text className={`text-[16px] mr-2 ${activeTab === 'New list' ? 'text-blue-500' : 'text-black dark:text-white'}`}>New list</Text>
					</TouchableOpacity>
					<Animated.View style={[
						{
							position: 'absolute',
							bottom: -1,
							height: 4.5,
							borderTopLeftRadius: 4,
							borderTopRightRadius: 4,
							backgroundColor: '#3b82f6',
						}, animatedStyle]} />
				</ScrollView>
			</View>
			{/*Dialog*/}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}
			>
				<DialogContent className='w-[80vw] gap-0'>
					<DialogTitle>Add New List</DialogTitle>
					<DialogDescription className='mt-1.5'>
						Add a new list to organize your tasks.
					</DialogDescription>
					<Text className="text-sm font-semibold mt-5">List Name</Text>
					<Input value={listInput} selectionColor="gray" className='mt-2' placeholder="Enter list name here..."
						onChangeText={(text) => setListInput(text)}
					/>
					<Button className='bg-blue-500 mt-5' onPress={newListClicked}>
						<Text>Add Task</Text>
					</Button>
				</DialogContent>
			</Dialog>
			{/*Time Picker*/}
			{
				showPicker && (
					<DateTimePicker
						testID="dateTimePicker"
						value={time}
						mode="date"
						is24Hour={true}
						display="default"
						onChange={onChange}
					/>
				)
			}
			{/* Tasks */}
			<View className="flex-1">
				{activeTab === 'Starred' && starredTasks.length === 0 ? (
					<View className="mx-auto max-w-md text-center mt-[20vh]">
						<Star className="mx-auto text-blue-500"
							size={104}
							strokeWidth={1.2}
						/>
						<Text className="mt-4 text-3xl justify-center text-center font-bold tracking-tight text-foreground sm:text-4xl dark:text-white">
							No starred tasks
						</Text>
						<Text className="mt-4 text-center mx-10 text-muted-foreground dark:text-gray-400">
							Star your important tasks to keep them handy. Once you star a task, it will appear here.
						</Text>
					</View>
				) : activeTab === 'Starred' && starredTasks.length > 0 ? (
					<ScrollView className="flex-1 mx-0 min-h-[84vh]" showsVerticalScrollIndicator={false}>
						{starredTasks.map((task, index) => (
							<View key={index} className="flex-row items-center justify-between border-b border-gray-300 p-4"
							>
								<View className='flex-row items-center flex-1'
									onTouchStart={() => {
										const newTasks = [...tasks];
										newTasks[index].completed = !task.completed;
										setTasks(newTasks);

									}}
								>
									<Checkbox className='rounded-full ml-4' checked={task.completed} onCheckedChange={(checked) => {
										const newTasks = [...tasks];
										newTasks[index].completed = checked;
										setTasks(newTasks);
									}
									} />
									<View className={`flex-1 ml-5 mr-6 ${task.completed ? 'opacity-55' : ''}`} >
										<Text className={`text-lg font-semibold truncate ${task.completed ? 'line-through' : ''}`}>{task.description}</Text>
										<Text className={`text-sm text-gray-500 truncate ${task.completed ? 'line-through' : ''}`}>{task.date.toLocaleDateString()}</Text>
									</View>
								</View>
								<TouchableOpacity className='h-10 w-10 items-center justify-center mr-2'
									onPress={() => {
										const newTasks = [...tasks];
										newTasks.splice(index, 1);
										setTasks(newTasks);
									}
									}
								>
									<Trash2Icon className="text-gray-900" size={24} />
								</TouchableOpacity>
							</View>
						))}
					</ScrollView>
				) : null
				}
			</View>

			{/*Drawer*/}
			<View className="flex-1">
				{isOpen && (
					<TouchableOpacity
						className="absolute inset-0 bg-gray-500 bg-opacity-50"
						onPress={closeDrawer}
						activeOpacity={1}
					/>
				)}

				<Animated.View
					className={`absolute left-0 right-0 z-40 bottom-0 bg-white rounded-t-3xl shadow-none border-b border-t border-x border-gray-200`}
					style={[
						{
							height: DRAWER_HEIGHT,
							transform: [{ translateY: translateY }],
						},
						animatedStyles,
					]}
					{...panResponder.panHandlers}
				>
					<View className="w-16 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
					<View className="p-6">
						<Text className="text-2xl font-bold mb-2">Add New Task</Text>
						<Text className="mb-6">
							Add new tasks to your list. You can also add a due date and assign to a list.
						</Text>
						<Text className="text-sm font-semibold mb-2">Task Name</Text>
						<Input placeholder="Enter task name here..." className="mb-4"
							onChangeText={(text) => setInputText(text)}
							value={inputText}
							selectionColor="gray"
							maxLength={40}
						/>
						<Text className="text-sm font-semibold mb-2">
							Due Date
						</Text>
						<Button variant="outline" className="mb-4" onPress={() => { showTimePicker() }}
						>
							<Text>
								{time.toLocaleDateString()}
							</Text>
						</Button>
						<Text className="text-sm font-semibold mb-2">
							Assign to List
						</Text>
						<Select value={{ value: selectedList, label: selectedList }} className='mb-4' defaultValue={{ value: 'My Tasks', label: 'My Tasks' }}
							onValueChange={(value) => setSelectedList(value.value)}
						>
							<SelectTrigger className='w-[280px]'>
								<SelectValue
									className='text-foreground text-sm native:text-lg'
									placeholder='Select a list'
								/>
							</SelectTrigger>
							<SelectContent insets={contentInsets} className='w-[280px]'
								side='top'
							>
								<SelectGroup>
									<SelectLabel>Lists</SelectLabel>
									<SelectItem label='My Tasks' value='My Tasks'>
										<Text>My Tasks</Text>
									</SelectItem>
									{Lists.map((item, index) => (
										<SelectItem key={index} label={item} value={item}>
											<Text>
												{item}
											</Text>
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						<View className="flex-row items-center mb-6 mt-2 ml-2 mx-1">
							<Text
								className="flex-1 text-xl font-semibold"
								nativeID="airplane-mode"
							>
								Star:
							</Text>
							<Switch className={`${starred ? 'bg-blue-500' : ' bg-gray-300'} ml-auto`} checked={starred} onCheckedChange={setStarred} nativeID="star" />
						</View>
						<Button className="w-full bg-blue-500" onPress={addTask}>
							<Text className="text-white">Add Task</Text>
						</Button>
					</View>
				</Animated.View>
			</View >

			{/* Hovering Icon */}
			< TouchableOpacity className='z-30 absolute bottom-8 right-8 rounded-full bg-blue-400 dark:bg-white h-[68px] w-[68px] flex items-center justify-center'
				onPress={openDrawer}
			>
				<Plus className='text-white dark:text-black' size={26} />
			</TouchableOpacity >
		</View >
	);
}
