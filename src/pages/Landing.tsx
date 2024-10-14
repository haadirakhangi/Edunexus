import { Box, Flex, Heading, Text, Button, Image, VStack, HStack } from '@chakra-ui/react';
import { Navbar } from '../components/navbar';

export default function LandingPage() {
  return (
    <Box bg={"purple.600"} minHeight={'100vh'}> {/* Change to minHeight for better responsiveness */}
      <Navbar />
      <VStack spacing={4} align="center" py={5} px={4}> {/* Add padding for smaller screens */}
        <Box textAlign="center">
          {/* <Heading as="h1" size={['2xl', '3xl']} color="white" display="inline">
            Welcome to{' '}
          </Heading> */}
          <Heading as="h1" size={['4xl', '4xl']} style={{fontFamily: "MyCustomFont"}} color="white" display="inline">
            EduNexus
          </Heading>
        </Box>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          px={'10'}
          flexDirection={['column', 'column', 'row']} // Stack on small screens, row on larger ones
        >
          <Box flex={1} bg={'white'} p={'5'} borderRadius={20} style={{ boxShadow: "20px 20px 20px rgba(0, 0, 0, 0.5)" }}>
            <Heading as="h2" className='roboto-bold' size={['xl', '2xl']} mb={8} color="purple.600">
              Transforming Classrooms with Intelligent Solutions
            </Heading>
            <Text color="black" className='roboto-regular' textAlign="justify">
              Our platform harnesses the power of AI to transform education, offering intelligent tools that enhance both teaching and learning experiences. From real-time content updates for educators to personalized learning pathways and AI-driven mock interviews for students, we bridge the gap between academia and career readiness. With features like skill gap analysis, automated note-taking, and dynamic labs, we provide a seamless, adaptive learning environment designed to equip students with the knowledge and skills they need to succeed in an ever-evolving world.
            </Text>
            <HStack spacing={2} mt={5} justifyContent={['center', 'flex-start']}> {/* Center buttons on small screens */}
              <Button colorScheme="purple" size="lg" width={['150px', '200px']} variant="solid">
                Sign In
              </Button>
              <Button colorScheme="purple" size="lg" width={['150px', '200px']} variant="solid">
                Register
              </Button>
            </HStack>
          </Box>
          <Box flexShrink={0} mt={[8, 0]}> {/* Add margin on top for smaller screens */}
            <Image
              src="./src/assets/wobg.png"
              alt="Right-aligned image"
              maxWidth={['300px', '400px', '500px']} // Responsive image sizing
              mx={['auto', 0]} // Center image on small screens
            />
          </Box>
        </Flex>
      </VStack>
    </Box>
  );
}
