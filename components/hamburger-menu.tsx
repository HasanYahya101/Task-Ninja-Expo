import { View } from 'lucide-react-native';
import React, { useState } from 'react';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View
            className='flex-row items-center gap-2'
        //onClick={() => setIsOpen(!isOpen)}
        >
            <View className='w-6 h-1 bg-foreground' />
            <View className='w-6 h-1 bg-foreground' />
            <View className='w-6 h-1 bg-foreground' />
        </View>
    );
}

export default HamburgerMenu;