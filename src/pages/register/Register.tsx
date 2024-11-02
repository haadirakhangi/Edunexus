import { Navbar } from '../../components/navbar';
import {
  Box,
  Flex,
  HStack,
  useToast,
  useColorModeValue,
  Text,
  Link,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  FormErrorMessage,
  Tabs, TabList, TabPanel, Tab, TabPanels
} from '@chakra-ui/react';
import StudentRegister from './StudentRegister';
import TeacherRegister from './TeacherRegister';

const Register = () => {
  return(
    <div>
      <Navbar />
      
        
          <Box mt={5}>
            <Tabs isFitted variant='soft-rounded' colorScheme='purple'>
            <TabList>
              <Tab>Teacher</Tab>
              <Tab>Student</Tab>
              <Tab>Company</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <TeacherRegister />
              </TabPanel>
              <TabPanel>
                <StudentRegister />
              </TabPanel>
              <TabPanel>
              </TabPanel>
            </TabPanels>
          </Tabs> 
          </Box>
          
    </div>

  );

}
export default Register;