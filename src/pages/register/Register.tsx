import { Navbar } from '../../components/navbar';
import {
  Box,
  Tabs, TabList, TabPanel, Tab, TabPanels
} from '@chakra-ui/react';
import StudentRegister from './StudentRegister';
import TeacherRegister from './TeacherRegister';

const Register = () => {
  return (
    <div>
      <Navbar />


      <Box mt={5}>
        <Tabs isFitted variant='enclosed' colorScheme='purple'>
          <TabList>
            <Tab>Teacher</Tab>
            <Tab>Student</Tab>
            <Tab>Company</Tab>
          </TabList>
          <TabPanels>
            <TabPanel bg={'purple.200'}>
              <TeacherRegister />
            </TabPanel>
            <TabPanel bg={'purple.200'}>
              <StudentRegister />
            </TabPanel>
            <TabPanel bg={'purple.200'}>
              <TeacherRegister />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

    </div>

  );

}
export default Register;