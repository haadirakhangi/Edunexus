import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../../components/navbar';
interface Module {
  moduleName: string;
  topics: string;
}

export default function Create() {
  const navigate = useNavigate();
  const toast = useToast();
  const [modules, setModules] = useState<Module[]>([{ moduleName: '', topics: '' }]);
  const [courseName, setCourseName] = useState<string>('');
  const [courseStyle, setCourseStyle] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const addModule = () => {
    setModules([...modules, { moduleName: '', topics: '' }]);
  };

  const handleModuleChange = (index: number, field: keyof Module, value: string) => {
    const newModules = [...modules];
    newModules[index][field] = value;
    setModules(newModules);
  };

  const deleteModule = (index: number) => {
    const newModules = modules.filter((_, i) => i !== index);
    setModules(newModules);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', courseName);
    formData.append('description', courseStyle);

    if (pdfFile) {
      formData.append('files[]', pdfFile);
    }

    modules.forEach((module, index) => {
      formData.append(`modules[${index}][moduleName]`, module.moduleName);
      formData.append(`modules[${index}][topics]`, module.topics);
    });

    try {
      const response = await axios.post('/api/query2/multimodal-rag-submodules', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      if (response.data.response) {
        navigate('/teacher/course');
      } else {
        toast({
          title: 'Failed to create course',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: 'An error occurred',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg={"#F8F6F4"} minHeight={'100vh'} minWidth={'100vw'}>
      <Navbar></Navbar>
      <Box width={'full'} display="flex"  alignItems="center" justifyContent="center" p={10}>
        <Box maxWidth="lg" bg={'#DFDFDF'} width="100%" p={10} borderWidth={1} borderRadius="xl" boxShadow="lg">
          <VStack spacing={6} align="stretch">
            <Heading  size="lg" className='roboto-bold'>
              Create Course
            </Heading>

            <FormControl isRequired>
              <FormLabel className='roboto-regular' >Course Name:</FormLabel>
              <Input
                placeholder="Enter the course name"
                value={courseName}
                borderColor={'purple.600'}
                _hover={{borderColor: "purple.600"}}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel className='roboto-regular'>Course Style:</FormLabel>
              <Input
                placeholder="Describe the course style"
                value={courseStyle}
                borderColor={'purple.600'}
                _hover={{borderColor: "purple.600"}}
                onChange={(e) => setCourseStyle(e.target.value)}
              />
            </FormControl>

            {/* <Box>
              <Text mb={2} className='roboto-regular'>Course Structure:</Text>
              {modules.map((module, index) => (
                <Box key={index} borderWidth={1} borderRadius="md" p={4} mb={4} position="relative">
                  <Tooltip label="Delete Module">
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      size="sm"
                      position="absolute"
                      top={2}
                      right={2}
                      aria-label="Delete Module"
                      onClick={() => deleteModule(index)}
                    />
                  </Tooltip>
                  <FormControl isRequired mb={2}>
                    <FormLabel className='roboto-regular'>{`Module ${index + 1} Name`}</FormLabel>
                    <Input
                      placeholder="Enter module name"
                      value={module.moduleName}
                      onChange={(e) => handleModuleChange(index, 'moduleName', e.target.value)}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel className='roboto-regular'>Topics</FormLabel>
                    <Textarea
                      placeholder="Enter topics (comma separated)"
                      value={module.topics}
                      onChange={(e) => handleModuleChange(index, 'topics', e.target.value)}
                    />
                  </FormControl>
                </Box>
              ))}
              <Tooltip label="Add new Module">
                <IconButton
                  icon={<AddIcon />}
                  onClick={addModule}
                  aria-label="Add Module"
                />
              </Tooltip>
            </Box> */}

            <FormControl>
              <FormLabel className='roboto-regular'>Upload Course Related PDFs</FormLabel>
              <Input
                type="file"
                borderColor={'purple.600'}
                p={1}
                multiple={true}
                _hover={{borderColor: "purple.600"}}
                accept=".pdf"
                onChange={handleFileChange}
              />
            </FormControl>

            <Button colorScheme="purple"  _focus={{ outline: 'none', boxShadow: 'none' }} className='roboto-regular' onClick={handleSubmit}>
              Create Baseline Course
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>

  );
}