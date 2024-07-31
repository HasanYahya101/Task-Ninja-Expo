import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, View } from 'react-native';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Text } from './ui/text';

export function ProfileButton() {
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
                    <Avatar
                        className='text-foreground'
                        size={5}
                        strokeWidth={1.25}
                    >
                        <AvatarImage
                            src='https://github.com/HasanYahya101.png'
                        />
                        <AvatarFallback>
                            <Text>HY</Text>
                        </AvatarFallback>
                    </Avatar>
                </View>
            )}
        </Pressable>
    );
}
