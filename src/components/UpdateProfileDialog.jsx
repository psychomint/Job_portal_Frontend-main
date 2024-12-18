import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { Pen } from 'lucide-react'; // Import Pen icon from lucide-react
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';

const UpdateProfileDialog = ({ onSave }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(state => state.auth);
    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.profile?.bio || '',
        skills: user?.skills || '',
        resume: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfileData({ ...profileData, resume: file });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullName', profileData.fullName);
        formData.append('email', profileData.email);
        formData.append('phoneNumber', profileData.phoneNumber);
        formData.append('bio', profileData.bio);
        formData.append('skills', profileData.skills);
        if (profileData.resume) {
            formData.append('resume', profileData.resume);
        }

        try {
            const response = await axios.patch(`${USER_API_END_POINT}/update-account`, 
                formData, 
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
        );
            if (response.data.success) {
                toast.success("Profile updated successfully!");
                onSave && onSave(response.data.user);
            } else {
                toast.error(response.data.message || "Failed to update profile.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong.";
            toast.error(errorMessage);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild className='border-none'>
                <Button variant="outline" className="flex items-center gap-2 text-gray-700 dark:text-white">
                    <Pen className="w-5 h-5" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-w-md bg-white dark:bg-gray-900 text-black dark:text-white max-h-[75vh] overflow-y-auto scrollbar-hidden p-6">
                <DialogHeader>
                    <DialogTitle className='text-2xl'>Update Your Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile information below. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={onSubmitHandler}>
                    <div className="space-y-1">
                        <Label htmlFor="fullName" className="text-sm font-medium">Name</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            value={profileData.fullName}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter your name"
                            className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Enter your email"
                            className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="skills" className="text-sm font-medium">Skills</Label>
                        <Input
                            id="skills"
                            name="skills"
                            value={profileData.skills}
                            onChange={handleChange}
                            placeholder="Enter your skills (comma-separated)"
                            className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            value={profileData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="resume" className="text-sm font-medium">Resume</Label>
                        <Input
                            id="resume"
                            name="resume"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={profileData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself"
                            className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                        />
                    </div>
                    <DialogFooter>
                        <div className="mt-6 flex justify-end space-x-2 px-1 pb-4">
                            <Button type="submit" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 disabled:opacity-50">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;
