import * as React from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp, FadeOutDown, LayoutAnimationConfig, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Info } from '~/lib/icons/Info';
//import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { Text } from '~/components/ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { Plus } from '~/lib/icons/Plus';
import { TouchableOpacity, ScrollView } from 'react-native';
import { Trash2Icon } from '~/lib/icons/Trash2Icon';
import { Checkbox } from '~/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Star } from '~/lib/icons/Star';
import { useState, useRef, useEffect } from 'react';
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

export default function Screen() {
	const [activeTab, setActiveTab] = React.useState('My Tasks');
	const [tabLayouts, setTabLayouts] = React.useState({});
	const tabPosition = useSharedValue(0);
	const tabWidth = useSharedValue(0);
	const [dialogOpen, setDialogOpen] = React.useState(false);

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

	const [isOpen, setIsOpen] = useState(false);
	const [startY, setStartY] = useState(0);
	const [currentY, setCurrentY] = useState(0);
	const drawerRef = useRef(null);

	const drawerHeight = 300; // Fixed height for the drawer

	const toggleDrawer = () => {
		setIsOpen(!isOpen);
		setCurrentY(0);
	};

	const handleTouchStart = (e) => {
		setStartY(e.touches[0].clientY);
	};

	const handleTouchMove = (e) => {
		const currentY = e.touches[0].clientY;
		const diff = currentY - startY;
		if (diff > 0) {
			setCurrentY(diff);
		}
	};

	const handleTouchEnd = () => {
		if (currentY > drawerHeight / 3) {
			setIsOpen(false);
		}
		setCurrentY(0);
	};

	useEffect(() => {
		const drawer = drawerRef.current;
		if (drawer) {
		}
	}, [startY]);

	return (
		<View className="z-10 flex-1 justify-start gap-0 p-0 bg-white dark:bg-black h-full">
			{/* Tabs */}
			<View className="flex-row border-b border-gray-400 mb-4 mx-0 mt-[22px] relative">
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
						onPress={() => handleTabPress('New list')}
						onLayout={onLayoutTab('New list')}
					>
						<Plus className={`w-4 h-4 mr-2 ${activeTab === 'New list' ? 'text-blue-500' : 'text-black dark:text-white'}`} />
						<Text className={`text-[16px] mr-2 ${activeTab === 'New list' ? 'text-blue-500' : 'text-black dark:text-white'}`}>New list</Text>
					</TouchableOpacity>
					<Animated.View style={[{
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

			{/*Drawer*/}
			<View
				ref={drawerRef}
				className={`fixed z-40 left-0 right-0 bottom-0 bg-white shadow-lg transition-all duration-300 ease-in-out transform rounded-t-3xl border-t border-x border-gray-300 ${isOpen ? '' : ''}`}
				style={{
					height: drawerHeight, // Provide as a number
					bottom: -drawerHeight, // Provide as a number
					transform: [{ translateY: isOpen ? -drawerHeight + currentY : 0 }],
				}}
			>
				{/* Drag handle */}
				<View onTouchMove={handleTouchMove} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
					className="w-16 h-1 bg-gray-300 rounded-full mx-auto mt-3"></View>

				<View className="p-6">
					<Text className="text-2xl font-bold mb-4">Drawer Content</Text>
					<Text>This is the content of your drawer. You can add any elements here.</Text>
					<Text className="mt-4">Drag down from the top to close this drawer.</Text>
				</View>
			</View>

			{/* Hovering Icon */}
			<TouchableOpacity className='z-30 absolute bottom-8 right-8 rounded-full bg-blue-400 dark:bg-white h-[68px] w-[68px] flex items-center justify-center'
				onPress={() => setIsOpen(true)}
			>
				<Plus className='text-white dark:text-black' size={26} />
			</TouchableOpacity>
		</View>
	);
}
