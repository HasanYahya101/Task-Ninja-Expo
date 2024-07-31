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
import { TouchableOpacity } from 'react-native';

export default function Screen() {

  return (
    <View className='z-10 flex-1 justify-center items-center gap-5 p-6 bg-secondary/30'>
      <TouchableOpacity
        className='z-30 absolute bottom-8 right-8 rounded-full bg-blue-500 h-[68px] w-[68px] flex items-center justify-center'
      >
        <Plus className='text-white' size={26}
        />
      </TouchableOpacity>
      <View className='flex-1 w-full'>
        {/*Dates*/}
        <View className='flex flex-row justify-between items-center'>
          <Text className='text-primary text-lg font-bold'>Today</Text>
          <Text className='text-primary text-lg font-bold'>Tomorrow</Text>
        </View>
      </View>
    </View>
  );
}
