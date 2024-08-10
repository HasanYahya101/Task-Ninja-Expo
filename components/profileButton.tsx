import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Pressable, View } from 'react-native';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Text } from './ui/text';
import { useState, useEffect, useRef } from 'react';
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
import { Input } from '~/components/ui/input';
import { Button } from './ui/button';
import { Keyboard, TouchableOpacity } from 'react-native';

export function ProfileButton() {
    const [username, setUsername] = useState('');
    const [githubusername, setGithubUsername] = useState('');

    const [usernameInput, setUsernameInput] = useState('');
    const [githubusernameInput, setGithubUsernameInput] = useState('');

    const [open, setOpen] = useState(false);

    const getdata = async () => {
        const username = await AsyncStorage.getItem('username');
        const githubusername = await AsyncStorage.getItem('githubusername');
        setUsername(username ?? '');
        setGithubUsername(githubusername ?? '');
    };

    useEffect(() => {
        getdata();
    }, []);

    const setAsyncusername = async (username: string) => {
        await AsyncStorage.setItem('username', username);
    };

    const setAsyncGithubUsername = async (githubusername: string) => {
        await AsyncStorage.setItem('githubusername', githubusername);
    };

    const ButtonClick = () => {
        setUsername(usernameInput);
        setGithubUsername(githubusernameInput);
        Keyboard.dismiss();
        setOpen(false);
    };

    const usernameMounted = useRef(true);
    const githubusernameMounted = useRef(true);

    useEffect(() => {
        if (usernameMounted.current) {
            usernameMounted.current = false;
            return;
        }
        setAsyncusername(username);
    }, [username]);

    useEffect(() => {
        if (githubusernameMounted.current) {
            githubusernameMounted.current = false;
            return;
        }
        setAsyncGithubUsername(githubusername);
    }, [githubusername]);


    return (
        <View>
            <Dialog open={open} onOpenChange={setOpen}
            >
                <DialogContent
                >
                    <DialogTitle>Edit Profile Info</DialogTitle>
                    <DialogDescription>
                        <View className="flex items-center justify-center">
                            {/* Profile Picture */}
                            <View className="items-center justify-center p-4">
                                <Avatar className="h-20 w-20 rounded-full"
                                    alt='Profile Picture'
                                >
                                    <AvatarImage
                                        source={{ uri: 'https://avatars.githubusercontent.com/' }} // the actual image breaks the dialog so i put it as a link that goes no where
                                        className='rounded-full'
                                    />
                                    <AvatarFallback>
                                        <Text className="text-gray-500 text-4xl">
                                            {username ? username[0].toUpperCase() : 'U'}
                                        </Text>
                                    </AvatarFallback>
                                </Avatar>
                            </View>
                            <View className="flex flex-col mt-2 w-full px-0">
                                <Text className="text-base font-semibold mb-1">Name</Text>
                                <Input
                                    value={usernameInput}
                                    selectionColor="gray"
                                    className="mt-1 border border-gray-300 rounded-md py-2 w-[68vw]"
                                    placeholder="Enter your name..."
                                    onChangeText={(text) => setUsernameInput(text)}
                                />
                                <Text className="text-base font-semibold mt-4 mb-1">Github Username</Text>
                                <Input
                                    value={githubusernameInput}
                                    selectionColor="gray"
                                    className="mt-1 border border-gray-300 rounded-md py-2 w-[68vw]"
                                    placeholder="Enter your github username..."
                                    onChangeText={(text) => setGithubUsernameInput(text)}
                                />
                            </View>
                            <Button className="mt-8 w-[68vw] bg-blue-500" onPress={() => {
                                ButtonClick();
                            }}>
                                <Text>Save</Text>
                            </Button>
                        </View>

                    </DialogDescription>
                </DialogContent>
            </Dialog>
            <TouchableOpacity>
                <Pressable
                    onPress={() => {
                        setOpen(true);
                        setUsernameInput(username);
                        setGithubUsernameInput(githubusername);
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
                            <Avatar alt='Profile Picture'
                                className='text-foreground h-12 w-12 ml-2 mt-2 rounded-full'
                            >
                                <AvatarImage
                                    source={{ uri: 'https://avatars.githubusercontent.com/' + githubusername }}
                                    className='rounded-full'
                                />
                                <AvatarFallback>
                                    <Text className='text-muted-foreground text-lg'
                                    >
                                        {/*if username is '', show U else show usernames first letter in capital*/}
                                        {username ? username[0].toUpperCase() : 'U'}
                                    </Text>
                                </AvatarFallback>
                            </Avatar>
                        </View>
                    )}
                </Pressable>
            </TouchableOpacity>
        </View>
    );
}
