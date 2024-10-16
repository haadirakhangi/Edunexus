import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Input,
  Flex,
  Spinner,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Text,
  Tooltip,
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../../components/navbar';
import { SubmoduleModal } from './submoduleModal';
import "../index.css"

export default function Create() {
  const navigate = useNavigate();
  const toast = useToast();
  const [courseName, setCourseName] = useState<string>('');
  const [courseStyle, setCourseStyle] = useState<string>('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [links, setLinks] = useState<string[]>(['']);
  const [includeImages, setIncludeImages] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submodules, setSubmodules] = useState<Record<string, string>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLink = () => {
    setLinks([...links, '']);
  };

  const deleteLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', courseName);
    formData.append('description', courseStyle);

    if (pdfFile) {
      formData.append('files[]', pdfFile);
    }

    formData.append('links', links.join(','));
    formData.append('includeImages', includeImages.toString());

    setLoading(true);

    try {
      const response = await axios.post('/api/query2/multimodal-rag-submodules', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      if (response.data.submodules) {
        setSubmodules(response.data.submodules);
        setIsModalOpen(true); // Open modal after successful response
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
    } finally {
      setLoading(false);
    }
  };


  const handleModalSubmit = async (updatedSubmodules: Record<string, string>) => {

    try {
      // Send the updated submodules via Axios
      const response = await axios.post('/api/update-submodules', updatedSubmodules);

      if (response.status === 200) {
        toast({
          title: 'Submodules updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/teacher/course');
      } else {
        throw new Error('Failed to update submodules.');
      }
    } catch (error) {
      console.error('Error updating submodules:', error);

      // Show an error toast
      toast({
        title: 'Failed to update submodules.',
        description: 'An error occurred while updating submodules.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };


  return (
    <>
      {loading ? (
        <>
          <Navbar />
          <Flex justify="center" align="center" width="100vw" height="90vh" textAlign="center">
            <VStack>
              <Spinner size="xl" color="purple.500" />
              <Heading>Generating SubModules...</Heading>
            </VStack>
          </Flex>
        </>
      ) : (
        <Box bg={"#F8F6F4"} minHeight={'100vh'} minWidth={'100vw'}>
          <Navbar></Navbar>
          <Box width={'full'} display="flex" alignItems="center" justifyContent="center" p={10}>
            <Box maxWidth="lg" bg={'#DFDFDF'} width="100%" p={10} borderWidth={1} borderRadius="xl" boxShadow="lg">
              <VStack spacing={6} align="stretch">
                <Text size="2xl" align="center" style={{ fontFamily: 'Comfortaa', fontWeight: 400 }}>
                  <b>Create Course</b>
                </Text>

                <FormControl isRequired>
                  <FormLabel className='roboto-regular'>Course Name:</FormLabel>
                  <Input
                    placeholder="Enter the course name"
                    value={courseName}
                    borderColor={'purple.600'}
                    _hover={{ borderColor: "purple.600" }}
                    onChange={(e) => setCourseName(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel className='roboto-regular'>Course Style:</FormLabel>
                  <Input
                    placeholder="Describe the course style"
                    value={courseStyle}
                    borderColor={'purple.600'}
                    _hover={{ borderColor: "purple.600" }}
                    onChange={(e) => setCourseStyle(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel className='roboto-regular'>Upload Course Related PDFs</FormLabel>
                  <Input
                    type="file"
                    borderColor={'purple.600'}
                    p={1}
                    multiple={true}
                    _hover={{ borderColor: "purple.600" }}
                    accept=".pdf"
                    onChange={handleFileChange}
                  />
                </FormControl>

                <Box>
                  <FormLabel className='roboto-regular'>Links</FormLabel>
                  {links.map((link, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                      <Input
                        placeholder={`Enter link ${index + 1}`}
                        value={link}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}
                        onChange={(e) => handleLinkChange(index, e.target.value)}
                      />
                      <Tooltip label="Delete Link">
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          size="sm"
                          ml={2}
                          aria-label="Delete Link"
                          onClick={() => deleteLink(index)}
                        />
                      </Tooltip>
                    </Box>
                  ))}
                  <Tooltip label="Add new Link">
                    <IconButton
                      icon={<AddIcon />}
                      onClick={addLink}
                      aria-label="Add Link"
                    />
                  </Tooltip>
                </Box>

                <FormControl display="flex" alignItems="center">
                  <Checkbox
                    isChecked={includeImages}
                    size={'lg'}
                    borderColor={"purple.700"}
                    _focus={{ outline: 'none', boxShadow: 'none' }}
                    variant={"solid"}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    colorScheme="purple"
                  >
                    Include Images
                  </Checkbox>
                </FormControl>

                <Button colorScheme="purple" _focus={{ outline: 'none', boxShadow: 'none' }} className='roboto-regular' onClick={handleSubmit}>
                  Create Baseline Course
                </Button>
              </VStack>
            </Box>
          </Box>
        </Box>
      )}
      <SubmoduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialSubmodules={submodules}
        onSubmit={handleModalSubmit}
      />
    </>
  );
}
