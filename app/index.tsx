import * as React from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp, FadeOutDown, LayoutAnimationConfig } from 'react-native-reanimated';
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

export default function Screen() {

	const [activeTab, setActiveTab] = React.useState('My Tasks');

	return (
		<View className='z-10 flex-1 justify-start gap-0 p-0 bg-white dark:bg-black h-full'>
			{/* Tabs */}
			<View className="flex-row border-b border-gray-400 mb-4 mx-0 mt-[22px]">
				<TouchableOpacity
					className="ml-6 mr-4 flex-row items-center pb-2 relative"
					onPress={() => setActiveTab('Starred')}
				>
					<Star className={`w-4 h-4 ${activeTab === 'Starred' ? 'text-blue-500' : 'text-black'}`} />
					{activeTab === 'Starred' && (
						<View style={{
							position: 'absolute',
							bottom: -1,
							left: 0,
							right: 0,
							height: 4,
							borderTopLeftRadius: 4,
							borderTopRightRadius: 4,
						}} className='bg-blue-500' />
					)}
				</TouchableOpacity>
				<TouchableOpacity
					className="ml-4 mr-4 flex-row items-center pb-2 relative"
					onPress={() => setActiveTab('My Tasks')}
				>
					<Text className={`text-[16px] ml-1 mr-1 ${activeTab === 'My Tasks' ? 'text-blue-500' : 'text-black'}`}>My Tasks</Text>
					{activeTab === 'My Tasks' && (
						<View style={{
							position: 'absolute',
							bottom: -1,
							left: 0,
							right: 0,
							height: 4,
							borderTopLeftRadius: 4,
							borderTopRightRadius: 4,
						}} className='bg-blue-500' />
					)}
				</TouchableOpacity>
				<TouchableOpacity
					className="ml-4 mr-6 flex-row items-center pb-2 relative"
					onPress={() => setActiveTab('New list')}
				>
					<Plus className={`w-4 h-4 mr-2 ${activeTab === 'New list' ? 'text-blue-500' : 'text-black'}`} />
					<Text className={`text-[16px] mr-2 ${activeTab === 'New list' ? 'text-blue-500' : 'text-black'}`}>New list</Text>
					{activeTab === 'New list' && (
						<View style={{
							position: 'absolute',
							bottom: -1,
							left: 0,
							right: 0,
							height: 4,
							borderTopLeftRadius: 4,
							borderTopRightRadius: 4,
						}} className='bg-blue-500' />
					)}
				</TouchableOpacity>
			</View>

			{/* Hovering Icon */}
			<TouchableOpacity
				className='z-30 absolute bottom-8 right-8 rounded-full bg-blue-400 dark:bg-white h-[68px] w-[68px] flex items-center justify-center'
			>
				<Plus className='text-white dark:text-black' size={26} />
			</TouchableOpacity>
		</View>
	);
}
