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

export default function Screen() {

	const days = [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()];
	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'short', month: 'short', day: 'numeric'
		});
	};


	return (
		<View className='z-10 flex-1 justify-start items-center gap-0 p-0 bg-white dark:bg-black h-full'>
			<ScrollView
				horizontal
				contentContainerStyle={{ paddingHorizontal: 10 }}
				showsHorizontalScrollIndicator={false}
				className='w-full mt-3 mb-0 max-h-12'
			>
				{days.map((day, index) => (
					<TouchableOpacity
						key={index}
						className='p-3 bg-blue-400 dark:bg-gray-50 rounded-full shadow-md mx-1.5 max-h-12'
					>
						<Text className='text-primary font-bold text-white dark:text-black'>{formatDate(day)}</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
			{/*Main Content*/}
			<ScrollView className='w-full h-full p-4' contentContainerStyle={{ padding: 10 }}
			>

			</ScrollView>
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
