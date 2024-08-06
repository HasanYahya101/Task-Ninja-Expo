import * as React from 'react';
import { View, Dimensions, PanResponder } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { TouchableOpacity, ScrollView } from 'react-native';
import { Plus } from '~/lib/icons/Plus';
import { Star } from '~/lib/icons/Star';
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

const { height } = Dimensions.get('window');
const DRAWER_HEIGHT = 498;

class Task {
	constructor(
		public description: string,
		public date: Date,
		public starred: boolean,
		public listName: string
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
	const [activeTab, setActiveTab] = React.useState('My Tasks');
	const [tabLayouts, setTabLayouts] = React.useState({});
	const tabPosition = useSharedValue(0);
	const tabWidth = useSharedValue(0);
	const [isOpen, setIsOpen] = useState(false);
	const translateY = useSharedValue(DRAWER_HEIGHT);
	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: insets.bottom,
		left: 12,
		right: 12,
	};
	const [tasks, setTasks] = useState([] as Task[]);
	const [Lists, setLists] = useState([] as string[]);

	const getTasks = async () => {
		try {
			const tasksJson = await AsyncStorage.getItem('tasks');
			const tasks: Task[] = tasksJson
				? JSON.parse(tasksJson).map((task: any) => Task.fromJson(task))
				: [];

			setTasks(tasks);
		} catch (error) {
			console.error('Error getting tasks:', error);
		}
	};

	const saveTask = async (newTasks: Task[]) => {
		try {
			const existingTasksJson = await AsyncStorage.getItem('tasks');
			const existingTasks: Task[] = existingTasksJson
				? JSON.parse(existingTasksJson).map((task: any) => Task.fromJson(task))
				: [];

			// Merge new tasks with existing tasks
			const updatedTasks = [...existingTasks, ...newTasks];

			// Save updated task list
			await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
		} catch (error) {
			console.error('Error saving task:', error);
		}
	};

	const _setTasks_ = async (newTasks: Task[]) => {
		// set new tasks along with existing in the state
		setTasks((prevTasks) => [...prevTasks, ...newTasks]);

		// save new tasks to async storage
		saveTask(newTasks);
	};

	React.useEffect(() => {
		if (tabLayouts['My Tasks']) {
			tabPosition.value = tabLayouts['My Tasks'].x;
			tabWidth.value = tabLayouts['My Tasks'].width;
		}
	}, [tabLayouts]);

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

	const [inputText, setInputText] = useState('');
	const [time, setTime] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);

	const onChange = (event, selectedTime) => {
		const currentTime = selectedTime || time;
		setShowPicker(false);
		setTime(currentTime);
	};

	const showTimePicker = () => {
		setShowPicker(true);
	};

	const [starred, setStarred] = useState(false);
	const [selectedList, setSelectedList] = useState('My Tasks');

	const addTask = () => {
		const newTask = new Task(inputText, time, starred, selectedList);
		setInputText('');
		setTime(new Date());
		setStarred(false);
		setSelectedList('My Tasks');
		_setTasks_([newTask]);
	};

	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<View className="z-10 flex-1 justify-start gap-0 p-0 bg-white dark:bg-black h-full">
			{/* Tabs */}
			<View className="flex-row border-b border-gray-400 mb-4 mx-0 mt-[28px] relative">
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
					<TouchableOpacity
						className="ml-4 mr-6 flex-row items-center pb-2 relative mb-1.5"
						onPress={() => { setDialogOpen(true) }}
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
			{/* Tasks */}

			{/*Dialog*/}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}
			>
				<DialogContent className='w-[80vw] gap-0'>
					<DialogTitle>Add New List</DialogTitle>
					<DialogDescription className='mt-1.5'>
						Add a new list to organize your tasks.
					</DialogDescription>
					<Text className="text-sm font-semibold mt-5">List Name</Text>
					<Input selectionColor="gray" className='mt-2' placeholder="Enter list name here..." />
					<Button className='bg-blue-500 mt-5' onPress={() => { }}>
						<Text>Add Task</Text>
					</Button>
				</DialogContent>
			</Dialog>
			{/*Time Picker*/}
			{showPicker && (
				<DateTimePicker
					testID="dateTimePicker"
					value={time}
					mode="date"
					is24Hour={true}
					display="default"
					onChange={onChange}
				/>
			)}

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
							<SelectContent insets={contentInsets} className='w-[280px]'>
								<SelectGroup>
									<SelectLabel>Lists</SelectLabel>
									<SelectItem label='My Tasks' value='My Tasks'>
										My Tasks
									</SelectItem>
									{Lists.map((item, index) => (
										<SelectItem key={index} label={item} value={item}>
											{item}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
						<Text className="text-sm font-semibold mb-2">Task Name</Text>
						<Input placeholder="Enter task name here..." className="mb-4"
							onChangeText={(text) => setInputText(text)}
							value={inputText}
							selectionColor="gray"
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
						<View className="flex-row items-center mb-6 mt-2 ml-2 mx-1">
							<Text
								className="flex-1 text-xl font-semibold"
								nativeID="airplane-mode"
							>
								Star:
							</Text>
							<Switch className={`${starred ? 'bg-blue-500' : ' bg-gray-300'} ml-auto`} checked={starred} onCheckedChange={setStarred} nativeID="star" />
						</View>
						<Button className="w-full bg-blue-500" onPress={() => { }}>
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
