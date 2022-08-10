import React, { useEffect, useState } from 'react';
import { Avatar, Input, Button, Row, Col, Divider } from 'antd';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import useSettings from '../../hooks/useSettings';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
const { TextArea } = Input;

const ManageSettings = () => {
  const [loading, setLoading] = useState(false);

  const {
    name,
    address,
    email,
    contactNumber,
    website,
    companyLogo,
    description,
    setName,
    setAddress,
    setEmail,
    setContactNumber,
    setWebsite,
    setCompanyLogo,
    setDescription,
  } = useSettings();

  const handleUpdateSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/admin/settings`, {
        slug: 'company',
        name,
        address,
        contactNumber,
        email,
        website,
        description,
        companyLogo,
      });
      toast.success('success');
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const handleDescription = (e) => {
    setDescription(e);
  };
  return (
    <Layout title="Manage Messages">
      <AdminRoute>
        <h1 className="lead">Company Details</h1>
        <hr />
        <Row>
          <Col span={18} offset={2}>
            <Divider>
              <h1>Company Settings</h1>
              {/* <p>Set full width image title and subtitle</p> */}
            </Divider>
          </Col>

          <Col span={12} offset={5}>
            {/* <Media /> */}

            <Input
              style={{ margin: '5px 0px 20px 0px' }}
              size="large"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              style={{ margin: '5px 0px 20px 0px' }}
              size="large"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              style={{ margin: '5px 0px 20px 0px' }}
              size="large"
              placeholder="Enter contact"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
            <Input
              style={{ margin: '5px 0px 20px 0px' }}
              size="large"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              style={{ margin: '5px 0px 20px 0px' }}
              size="large"
              placeholder="Enter website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />

            <Editor
              apiKey="nti1dzmlp7xe935k4cysx2rcp0zxrnsva5pc01n76kx1j9xh"
              // initialValue=""
              init={{
                height: 200,
                menubar: true,
                selector: 'textarea', // change this value according to your HTML
                images_upload_url: 'postAcceptor.php',
                automatic_uploads: false,
                images_reuse_filename: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount',
                ],

                toolbar:
                  'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style:
                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
              value={description}
              onEditorChange={handleDescription}
            />
            <Button
              onClick={handleUpdateSubmit}
              type="primary"
              style={{ margin: '15px 0px 25px 0px' }}
              // loading={loading}
              block
            >
              Save
            </Button>
          </Col>
        </Row>
      </AdminRoute>
    </Layout>
  );
};

export default ManageSettings;
