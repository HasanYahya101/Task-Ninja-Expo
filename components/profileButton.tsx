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
                    <DialogHeader>
                        <DialogTitle>Edit Profile Info</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <View className='flex items-center justify-center'>
                            {/* Profile Picture */}
                            <Avatar
                                className='text-foreground ml-2 mt-2 h-[80px] w-[80px] rounded-full border border-gray-100'
                            >
                                <AvatarImage
                                    src={`https://github.com/${githubusername}.png`}
                                />
                                <AvatarFallback>
                                    <Text className='text-muted-foreground text-4xl'
                                    >
                                        {/*if username is '', show U else show usernames first letter in capital*/}
                                        {username ? username[0].toUpperCase() : 'U'}
                                    </Text>
                                </AvatarFallback>
                            </Avatar>
                            <View className='flex flex-col ml-4'>
                                <Text className='text-sm font-semibold mb-0'>Name</Text>
                                <Input value={username} selectionColor="gray" className='mt-2' placeholder="Enter your name..."
                                    onChangeText={(text) => setUsername(text)}
                                />
                                <Text className='text-sm font-semibold mb-0'>Github Username</Text>
                                <Input value={githubusername} selectionColor="gray" className='mt-2' placeholder="Enter your github username..."
                                    onChangeText={(text) => setGithubUsername(text)}
                                />
                            </View>
                        </View>
                    </DialogDescription>
                </DialogContent>
                <DialogFooter>

                </DialogFooter>
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
