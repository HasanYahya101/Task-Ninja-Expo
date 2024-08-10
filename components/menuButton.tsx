import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Pressable, View } from 'react-native';
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
import { DevSettings } from 'react-native';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Linking } from 'react-native';
import { Github } from '~/lib/icons/Github';
import { BackHandler } from 'react-native';

export function MenuButton() {
    const [open, setOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    const clearData = async () => {
        await AsyncStorage.clear();
        // reload the app
        DevSettings.reload();
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen} className='web:z-50'
        >
            <DropdownMenu onOpenChange={setOpenMenu}
            >
                <DropdownMenuTrigger asChild
                >
                    <Pressable
                        onPress={() => {
                            //setOpen(true);
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
                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' align='start' className='w-[134px]'
                >
                    <DropdownMenuLabel>
                        Select action
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onPress={() => {
                                // go to github.com/HasanYahya101
                                Linking.openURL('https://github.com/HasanYahya101/Task-Ninja-Expo').catch((err) => console.error('An error occurred while opening Github', err));
                            }}
                        >
                            <Text>
                                Github
                            </Text>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onPress={() => {
                                Alert.alert('About Info', 'This is a simple app to track your daily tasks. It was created by @HasanYahya101 and the source code can be found on Github.');
                            }}
                        >
                            <Text>
                                About
                            </Text>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onPress={() => {
                                setOpen(true);
                            }}
                        >
                            <Text>
                                Clear Data
                            </Text>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onPress={() => {
                                // reload the app
                                DevSettings.reload();
                            }}
                        >
                            <Text>
                                Reload
                            </Text>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onPress={() => {
                                BackHandler.exitApp();
                            }}
                        >
                            <Text>
                                Exit
                            </Text>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>

            </DropdownMenu>
            <AlertDialogContent className='w-[80vw]'
            >
                {/* Do you want to remove everything from async storage? */}
                <AlertDialogTitle><Text>Warning</Text></AlertDialogTitle>
                <AlertDialogDescription>
                    <Text>
                        Do you want to remove all data? This will also reload the app.
                    </Text>
                </AlertDialogDescription>
                <AlertDialogFooter className='mt-4 gap-4'
                >
                    <AlertDialogCancel
                    >
                        <Text
                        >
                            Cancel
                        </Text>
                    </AlertDialogCancel>
                    <AlertDialogAction onPress={clearData}
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
