import { View } from 'lucide-react-native';
import React, { useState } from 'react';
import { Menu } from '.././lib/icons/Menu';
import { Pressable } from 'react-native';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Pressable
            onPress={() => setIsOpen(!isOpen)}
        >
            <View className='flex-1 aspect-square pt-0.5 justify-center items-start web:px-5 ml-1'>
                <Menu className='text-foreground' size={24} strokeWidth={1.25} />
            </View>
        </Pressable>
    );
}

export default HamburgerMenu;