import PropTypes from 'prop-types'; // Importing prop-types for validation
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';
import '../../css files/ALLanimation.css';

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica' },
    header: { textAlign: 'center', marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
    line: { height: 2, backgroundColor: '#000', marginVertical: 10 },
    section: { marginBottom: 15 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    label: { fontSize: 12, fontWeight: 'bold', color: '#333' },
    value: { fontSize: 12, color: '#555' },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, textDecoration: 'underline' }
});

const ResumePDF = ({ application }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>{application.firstName} {application.lastName}</Text>
                <Text>{application.email} | {application.contact}</Text>
            </View>
            <View style={styles.line}></View>

            {/* Personal Information */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Age:</Text>
                    <Text style={styles.value}>{application.age}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Gender:</Text>
                    <Text style={styles.value}>{application.gender}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Address:</Text>
                    <Text style={styles.value}>{application.address}, {application.city}, {application.pincode}</Text>
                </View>
            </View>

            {/* Qualification & Experience */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education & Experience</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Qualification:</Text>
                    <Text style={styles.value}>{application.qualification}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Experience:</Text>
                    <Text style={styles.value}>{application.experience}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Skills:</Text>
                    <Text style={styles.value}>{application.skills}</Text>
                </View>
            </View>

            {/* Job Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Preferences</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Current Company:</Text>
                    <Text style={styles.value}>{application.currentCompany || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Current Role:</Text>
                    <Text style={styles.value}>{application.currentRole || 'N/A'}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Expected Salary:</Text>
                    <Text style={styles.value}>{application.expectedSalary}</Text>
                </View>
            </View>

            {/* Applied Date */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Application Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Applied On:</Text>
                    <Text style={styles.value}>{new Date(application.createdAt).toLocaleDateString()}</Text>
                </View>
            </View>
        </Page>
    </Document>
);

// Added prop-types validation for ResumePDF component
ResumePDF.propTypes = {
    application: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        contact: PropTypes.string.isRequired,
        age: PropTypes.number.isRequired,
        gender: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        pincode: PropTypes.string.isRequired,
        qualification: PropTypes.string.isRequired,
        experience: PropTypes.string.isRequired,
        skills: PropTypes.string.isRequired,
        currentCompany: PropTypes.string,
        currentRole: PropTypes.string,
        expectedSalary: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired
    }).isRequired
};

function Resume() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                await axios.get('http://localhost:5000/admin/profile', { withCredentials: true });
            } catch {
                toast.error('Admin session expired. Redirecting to login...');
                navigate('/adminlogin');
            }
        };
        fetchAdminProfile();
    }, [navigate]);

    const fetchApplications = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/job-applications');
            setApplications(response.data);
        } catch {
            toast.error('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    const deleteApplication = async (id) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;

        try {
            await axios.delete(`http://localhost:5000/api/job-applications/${id}`);
            toast.success('Application deleted successfully');
            setApplications(applications.filter((app) => app._id !== id));
        } catch {
            toast.error('Failed to delete application');
        }
    };


    const openModal = (application) => {
        setSelectedApplication(application);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedApplication(null);
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white/20 backdrop-blur-md font-outfit rounded-xl w-[97%] h-[94vh] mx-auto mt-5 p-6">
            <h2 className="anime text-2xl text-center font-light mb-6">Job Applications</h2>

            {loading ? (
                <div className="flex justify-center items-center h-[80vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            ) : applications.length === 0 ? (
                <div className="flex justify-center items-center h-[80vh] text-lg font-medium text-gray-800">
                    No resumes are available right now
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[77vh] px-5 overflow-y-auto">
                    {applications.map((app) => (
                        <div key={app._id} className="anime bg-white/30 backdrop-blur-sm rounded-xl p-4 h-[32vh] border border-white/20">
                            <div className="mb-4">
                                <h3 className="text-lg font-medium">{app.firstName} {app.lastName}</h3>
                                <p className="text-sm text-gray-600">{app.email}</p>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <p>Contact: {app.contact}</p>
                                <p>Location: {app.city}</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => openModal(app)} className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700">
                                    View Details
                                </button>
                                <button onClick={() => deleteApplication(app._id)} className="w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && selectedApplication && (
                <div className="anime fixed inset-0 bg-white/20 flex justify-center items-center z-50">
                    <div className="bg-zinc-800 p-6 rounded-lg w-[90%] md:w-[60%] lg:w-[40%]">
                        <h2 className="anime text-xl  text-gray-200 text-center font-semibold mb-4">Application Details</h2>
                        <div className="anime space-y-2 text-sm text-gray-300 mb-4">
                            <p><strong>Full Name:</strong> {selectedApplication.firstName} {selectedApplication.lastName}</p>
                            <p><strong>Email:</strong> {selectedApplication.email}</p>
                            <p><strong>Contact:</strong> {selectedApplication.contact}</p>
                            <p><strong>Age:</strong> {selectedApplication.age}</p>
                            <p><strong>Gender:</strong> {selectedApplication.gender}</p>
                            <p><strong>Address:</strong> {selectedApplication.address}, {selectedApplication.city}, {selectedApplication.pincode}</p>
                            <p><strong>Applied On:</strong> {new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                            <p><strong>Qualification:</strong> {selectedApplication.qualification}</p>
                            <p><strong>Experience:</strong> {selectedApplication.experience}</p>
                            <p><strong>Skills:</strong> {selectedApplication.skills}</p>
                            <p><strong>Current Company:</strong> {selectedApplication.currentCompany || 'N/A'}</p>
                            <p><strong>Current Role:</strong> {selectedApplication.currentRole || 'N/A'}</p>
                            <p><strong>Expected Salary:</strong> {selectedApplication.expectedSalary}</p>
                        </div>
                        <PDFDownloadLink
                            document={<ResumePDF application={selectedApplication} />}
                            fileName={`${selectedApplication.firstName}_${selectedApplication.lastName}_Application.pdf`}
                            className="block w-full bg-green-600 text-white text-center py-2 rounded-full hover:bg-green-700 transition-colors mb-2"
                        >
                            {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
                        </PDFDownloadLink>
                        <button onClick={closeModal} className="w-full bg-gray-600 text-white py-2 rounded-full hover:bg-gray-700">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Resume;

