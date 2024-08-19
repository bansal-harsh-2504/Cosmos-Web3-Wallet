import toast from "react-hot-toast";
const copyToClipboard = (content) => {
    const newContent = content;
    navigator.clipboard.writeText(JSON.stringify(newContent).replaceAll(',', ' ').replaceAll('[', '').replaceAll(']', '').replaceAll('"', ''));
    toast.success('Copied to clipboard');
};
export default copyToClipboard;