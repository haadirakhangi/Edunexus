import React, { ReactNode } from 'react';
import {
    Box,
    Flex,
    Link,
    HStack,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { GithubIcon } from './icons';
import { Logo } from './icons';

interface NavLinkProps {
    href: string;
    children: ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ children, href }) => (
    <Link
      px={1}
      py={1}
      className="roboto-bold"
      rounded="md"
      href={href}
      textDecoration="none"  // No underline by default
      _hover={{transform: 'scale(1.1)', color: 'black', textDecoration: 'none' }} // No underline and change to black on hover
      transition="color 0.2 s ease-in-out" // Smooth transition for color change
    >
      {children}
    </Link>
  );


export const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box bg={"purple.300"} position="sticky" borderBottom={'4px'} borderColor={"purple.200"} paddingX={"20"} top={0} zIndex="sticky">
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                <IconButton
                    size={'md'}
                    icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                    aria-label={'Open Menu'}
                    display={{ md: 'none' }}
                    onClick={isOpen ? onClose : onOpen}
                />
                <HStack spacing={8} alignItems={'center'}>
                    <Box display={"flex"} _hover={{ transform: 'scale(1.1)', color: 'black' }} transition="transform 0.2s ease-in-out">

                        <Logo />
                        <Box
                            mt={2}
                            className="roboto-regular-italic"
                            fontSize={'lg'}
                            color="black"
                        >
                            EduNexus
                        </Box>
                    </Box>

                    <HStack as={'nav'} spacing={2} display={{ base: 'none', md: 'flex' }}>
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/teacher/create">Create</NavLink>
                    </HStack>
                </HStack>
                <Flex alignItems={'center'}>
                    <Link href="https://github.com/Vedant-K1/EduNexus-Client.git" _hover={{transform: 'scale(1.1)', color: 'black', textDecoration: 'none' }} isExternal mr={4}>
                        <GithubIcon />
                    </Link>
                    <Menu>
                        <MenuButton
                            as={Button}
                            rounded={'full'}
                            variant={'link'}
                            cursor={'pointer'}
                            minW={0}>
                            {/* Add an icon or avatar here if needed */}
                        </MenuButton>
                        <MenuList>
                            {/* Add any additional dropdown items here if needed */}
                            <MenuItem>
                                <Link href="/profile">Profile</Link>
                            </MenuItem>
                            <MenuItem>
                                <Link href="/settings">Settings</Link>
                            </MenuItem>
                            <MenuItem>
                                <Link href="/logout" color="red.500">Logout</Link>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>

            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }}>
                    <Stack as={'nav'} spacing={4}>
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/create">Create</NavLink>
                    </Stack>
                </Box>
            ) : null}
        </Box>
    );
};
