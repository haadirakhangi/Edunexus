import React, { ReactNode } from 'react';
import {
    Box,
    Flex,
    Link,
    HStack,
    IconButton,
    Stack,
    useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FaHome, FaPencilAlt } from 'react-icons/fa';
import { Logo } from './icons'; // Keep your existing Logo component

interface NavLinkProps {
    href: string;
    children: ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ children, href }) => (
    <Link
        px={2}
        py={1}
        className="feature-heading"
        rounded="md"
        color={"white"}
        href={href}
        textDecoration="none"  // No underline by default
        _hover={{ transform: 'scale(1.1)', color: 'purple.800', bg: 'white', textDecoration: 'none' }}
        transition="transform 0.3s ease-in-out"
    >
        {children}
    </Link>
);

export const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box bg={"purple.700"} position="sticky" boxShadow={'0 5px 6px rgba(0, 0, 0, 0.4)'} paddingX={"20"} top={0} zIndex="sticky">
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                {/* Hamburger Icon for mobile view */}
                <IconButton
                    size={'md'}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    aria-label={'Open Menu'}
                    display={{ md: 'none' }}
                    onClick={isOpen ? onClose : onOpen}
                />

                {/* Logo section */}
                <HStack spacing={8} alignItems={'center'}>
                    <Box display={"flex"} _hover={{ transform: 'scale(1.1)', color: 'black' }} transition="transform 0.2s ease-in-out">
                        <Logo color='white'/>
                        <Box mt={2} className="roboto-regular-italic" fontSize={'lg'} color="white">
                            EduNexus
                        </Box>
                    </Box>
                </HStack>

                {/* Desktop nav links pushed to the right */}
                <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }} ml="auto">
                    <NavLink href="/">
                        <HStack spacing={2}>
                            <FaHome size={24} />
                            <span>Home</span>
                        </HStack>
                    </NavLink>

                    <NavLink href="/teacher/create">
                        <HStack spacing={2}>
                            <FaPencilAlt />
                            <span>Create</span>
                        </HStack>
                    </NavLink>
                </HStack>

            </Flex>

            {/* Mobile menu when open */}
            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }}>
                    <Stack as={'nav'} spacing={4}>
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/teacher/create">Create</NavLink>
                    </Stack>
                </Box>
            ) : null}
        </Box>
    );
};
