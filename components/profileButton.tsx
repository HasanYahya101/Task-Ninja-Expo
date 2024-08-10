import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, View } from 'react-native';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { useColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Text } from './ui/text';
import { useState, useEffect } from 'react';
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

export function ProfileButton() {
    const [username, setUsername] = useState('');
    const [githubusername, setGithubUsername] = useState('');

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

    return (
        <View>
            <Dialog open={open} onOpenChange={setOpen}
            >
                <DialogContent className='w-[80vw]'
                >

                    <DialogTitle>Edit Profile Info</DialogTitle>
                    <DialogDescription>
                        <View className="flex items-center justify-center">
                            {/* Profile Picture */}
                            <View className="items-center justify-center p-4">
                                <Avatar className="h-20 w-20 rounded-full border border-gray-300">
                                    <AvatarImage src={`https://github.com/${githubusername}.png`} />
                                    <AvatarFallback>
                                        <Text className="text-gray-500 text-4xl">
                                            {username ? username[0].toUpperCase() : 'U'}
                                        </Text>
                                    </AvatarFallback>
                                </Avatar>
                            </View>
                            <View className="flex flex-col mt-2 w-full px-2">
                                <Text className="text-base font-semibold mb-1">Name</Text>
                                <Input
                                    value={username}
                                    selectionColor="gray"
                                    className="mt-1 border border-gray-300 rounded-md py-2 w-full"
                                    placeholder="Enter your name..."
                                    onChangeText={(text) => setUsername(text)}
                                />
                                <Text className="text-base font-semibold mt-6 mb-1">Github Username</Text>
                                <Input
                                    value={githubusername}
                                    selectionColor="gray"
                                    className="mt-1 border border-gray-300 rounded-md py-2 w-full"
                                    placeholder="Enter your github username..."
                                    onChangeText={(text) => setGithubUsername(text)}
                                />
                            </View>
                        </View>

                    </DialogDescription>
                </DialogContent>
            </Dialog>
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
                        <Avatar
                            className='text-foreground h-12 w-12 ml-2 mt-2 rounded-full'
                        >
                            <AvatarImage
                                src={`https://github.com/${githubusername}.png`}
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
        </View>
    );
}
