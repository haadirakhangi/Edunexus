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
import Signup from './StudentRegister';

const Register = () => {
  return(
    <div>
      <Navbar />
      
        
          <Box>
            <Tabs isFitted variant='soft-rounded' colorScheme='purple'>
            <TabList>
              <Tab>Teacher</Tab>
              <Tab>Student</Tab>
              <Tab>Company</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
              </TabPanel>
              <TabPanel>
              <p>
                  <Signup />
              </p>
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