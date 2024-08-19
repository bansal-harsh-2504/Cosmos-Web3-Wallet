import toast from "react-hot-toast";
const copyToClipboard = () => {
    navigator.clipboard.writeText(localStorage.getItem('mnemonic'));
    toast.success('Copied to clipboard');
};
export default copyToClipboard;