import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, View } from 'react-native';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Text } from './ui/text';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { useState } from 'react';
import { Menu } from '~/lib/icons/Menu';

export function MenuButton() {
    const [open, setOpen] = useState(false);
    return (
        <AlertDialog open={open} onOpenChange={setOpen} className='web:z-50'
        >
            <AlertDialogTrigger>
                <Pressable
                    onPress={() => {
                        setOpen(true);
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
            </AlertDialogTrigger>
            <AlertDialogContent className='w-[80vw]'
            >
                {/* Do you want to remove everything from async storage? */}
                <AlertDialogTitle><Text>Warning</Text></AlertDialogTitle>
                <AlertDialogDescription>
                    <Text>
                        Are you sure you want to log out?
                    </Text>
                </AlertDialogDescription>
                <AlertDialogFooter className='mt-4 gap-4'
                >
                    <AlertDialogCancel>
                        <Text>
                            Cancel
                        </Text>
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='bg-red-500'
                    >
                        <Text>
                            Clear Data
                        </Text>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
