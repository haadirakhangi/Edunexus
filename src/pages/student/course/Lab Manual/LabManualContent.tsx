import { Box} from '@chakra-ui/react';
import { renderMarkdown } from '../renderMarkdown';


interface LabManualContentProps {
  markdownText: string | undefined;
}

const LabManualContent: React.FC<LabManualContentProps> = ({ markdownText}) => {

  return (
    <Box p={8} width={'full'} height={'100vh'} display="flex">
      <Box bg={'white'} p={8} borderRadius={"30"} overflow={"scroll"}>
        {renderMarkdown(markdownText || "", [[]])}
      </Box>
    </Box>
  );
};

export default LabManualContent;
