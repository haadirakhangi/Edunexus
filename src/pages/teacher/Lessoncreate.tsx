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
  Center,
  Text,
  Tooltip,
  Select,
  Checkbox,
  useToast,
  useColorModeValue,
  FormErrorMessage,
  Switch
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../../components/navbar';
import { SubmoduleModal } from './submoduleModal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema using Yup
const schema = yup.object().shape({
  lessonName: yup.string().required('lesson name is required'),
  lessonStyle: yup.string().required('lesson style is required'),
  lessonType: yup.string().required('lesson type is required'),
  links: yup.array().of(yup.string().url('Invalid URL')),
  websitesReference: yup.string().required('Website references are required'),
});

const Create = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [includeImages, setIncludeImages] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submodules, setSubmodules] = useState<Record<string, string>>({});
  const [links, setLinks] = useState(['']);
  const [webSearch, setWebSearch] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      lessonName: '',
      lessonStyle: '',
      lessonType: '',
      links: [''],
      websitesReference: '',
    },
  });

  const handleAddLink = () => {
    setLinks([...links, '']); // Add a new link input
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index)); // Remove link input by index
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value; // Update link value
    setLinks(newLinks);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: { [key: string]: any }) => {
    const formData = new FormData();
    formData.append('title', data.lessonName);
    formData.append('description', data.lessonStyle);
    formData.append('lessonType', data.lessonType);
    formData.append('links', JSON.stringify(links));
    formData.append('websitesReference', data.websitesReference);
    formData.append('includeImages', includeImages.toString());
    formData.append('search_web', webSearch.toString());

    if (pdfFile) {
      formData.append('files[]', pdfFile);
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/query2/multimodal-rag-submodules', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.submodules) {
        setSubmodules(response.data.submodules);
        setIsModalOpen(true);
      } else {
        toast({
          title: 'Failed to create lesson',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
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
      const response = await axios.post('/api/update-submodules', updatedSubmodules);

      if (response.status === 200) {
        toast({
          title: 'Submodules updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/teacher/lesson');
      } else {
        throw new Error('Failed to update submodules.');
      }
    } catch (error) {
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
        <Box bg="purple.200" minHeight={'100vh'} minWidth={'100vw'}>
          <Navbar />
          <Box width={'full'} display="flex" alignItems="center" justifyContent="center" p={10}>
            <Box maxWidth="5xl" bg="white" width="100%" p={10} borderWidth={1} borderRadius="xl" boxShadow="lg">
              <Center>
                <Text className='main-heading' fontSize={"5xl"} color={"purple.600"}>
                  <b>Generate Lesson</b>
                </Text>
              </Center>
              <Center>
                <Text className='feature-heading' fontSize={"4xl"} mb={4}>
                  <b>Course name:</b> Large Language Models
                </Text>
              </Center>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction={['column', 'row']} justify="space-between" gap={6}>
                  {/* Left Section */}
                  <VStack width={['full', '45%']} spacing={6} align="stretch">
                    <FormControl isInvalid={!!errors.lessonName} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Lesson Name</b></FormLabel>
                      <Input
                        placeholder="Enter the lesson name"
                        {...register('lessonName')}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}
                      />
                      <FormErrorMessage>{errors.lessonName?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.lessonStyle} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Lesson Description</b></FormLabel>
                      <Input
                        placeholder="Describe the lesson"
                        {...register('lessonStyle')}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}
                      />
                      <FormErrorMessage>{errors.lessonStyle?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.lessonType} isRequired>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Lesson Type</b></FormLabel>
                      <Select
                        placeholder="Select lesson type"
                        {...register('lessonType')}
                        borderColor={'purple.600'}
                        _hover={{ borderColor: "purple.600" }}
                      >
                        <option value="theoretical">Theoretical</option>
                        <option value="mathematical">Mathematical</option>
                        <option value="practical">Practical</option>
                      </Select>
                      <FormErrorMessage>{errors.lessonType?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Web Search</b></FormLabel>
                      <Switch
                        isChecked={webSearch}
                        onChange={(e) => setWebSearch(e.target.checked)} // Manage Web Search switch state
                        colorScheme='purple'
                        size={"lg"}
                      />
                    </FormControl>
                  </VStack>

                  {/* Right Section */}
                  <VStack width={['full', '45%']} spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Upload Lesson Related PDFs</b></FormLabel>
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

                    <FormControl>
                      <FormLabel className='feature-heading' letterSpacing={2}><b>Links</b></FormLabel>
                      {links.map((link, index) => (
                        <Box key={index} display="flex" alignItems="center" mb={2}>
                          <Input
                            placeholder={`Enter link ${index + 1}`}
                            value={link}
                            onChange={(e) => handleLinkChange(index, e.target.value)} // Handle link change
                            borderColor={'purple.600'}
                            _hover={{ borderColor: "purple.600" }}
                          />
                          <Tooltip label="Delete Link">
                            <IconButton
                              icon={<DeleteIcon />}
                              colorScheme="red"
                              size="sm"
                              ml={2}
                              aria-label="Delete Link"
                              onClick={() => handleRemoveLink(index)} // Remove link
                            />
                          </Tooltip>
                        </Box>
                      ))}
                      <Tooltip label="Add new Link">
                        <IconButton
                          icon={<AddIcon />}
                          onClick={handleAddLink} // Add new link
                          aria-label="Add Link"
                        />
                      </Tooltip>
                    </FormControl>

                    {(pdfFile || links.some(link => link.trim() !== '')) && (
                      <FormControl display="flex" alignItems="center" mt={4}>
                        <Checkbox
                          isChecked={includeImages}
                          size={'lg'}
                          borderColor={"purple.700"}
                          _focus={{ outline: 'none', boxShadow: 'none' }}
                          variant={"solid"}
                          onChange={(e) => setIncludeImages(e.target.checked)}
                          colorScheme="purple"
                          className='feature-heading'
                          letterSpacing={2}
                        >
                          <b>Include Images</b>
                        </Checkbox>
                      </FormControl>
                    )}
                  </VStack>
                </Flex>
                <Button colorScheme="purple" _hover={{ bg: useColorModeValue('purple.600', 'purple.800'), color: useColorModeValue('white', 'white') }} variant="outline" type="submit" width="full" mt={4}>
                  Generate Base lesson
                </Button>
              </form>
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

export default Create;