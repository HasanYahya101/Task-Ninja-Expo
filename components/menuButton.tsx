import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, View } from 'react-native';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Text } from './ui/text';
import { Menu } from '~/lib/icons/Menu';

export function MenuButton() {
    return (
        <Pressable
            onPress={() => {
            }}
            className='web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2'
        >
            {({ pressed }) => (
                <View
                    className={cn(
                        'flex-1 aspect-square pt-0.5 justify-center items-start web:px-5',
                        pressed && 'opacity-70'
                    )}
                >
                    <Menu className='text-black dark:text-white h-12 w-12 ml-2 mt-[16PX]' />
                </View>
            )}
        </Pressable>
    );
}
