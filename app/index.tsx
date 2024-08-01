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
			{/*Tabs*/}
			<View className="flex-row border-b border-gray-700 mb-4 mx-3">
				<TouchableOpacity
					className={`flex-row items-center pb-2 ${activeTab === 'My Tasks' ? 'border-b-2 border-blue-500' : ''}`}
					onPress={() => setActiveTab('My Tasks')}
				>
					<Star className="w-4 h-4 mr-2 text-blue-500" />
					<Text>My Tasks</Text>
				</TouchableOpacity>
				<TouchableOpacity
					className={`flex-row items-center pb-2 ${activeTab === 'New list' ? 'border-b-2 border-blue-500' : ''}`}
					onPress={() => setActiveTab('New list')}
				>
					<Plus className="w-4 h-4 mr-2" />
					<Text>New list</Text>
				</TouchableOpacity>
			</View>

			{/*Hovering Icon*/}
			<TouchableOpacity
				className='z-30 absolute bottom-8 right-8 rounded-full bg-blue-400 dark:bg-white h-[68px] w-[68px] flex items-center justify-center'
			>
				<Plus className='text-white dark:text-black' size={26}
				/>
			</TouchableOpacity>
		</View>
	);
}
