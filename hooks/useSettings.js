import { useState, useEffect } from 'react';
import axios from 'axios';

const useSettings = () => {
  // state
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await axios.get('/api/admin/settings/company');
      setId(data._id);
      setName(data.name);
      setAddress(data.address);
      setEmail(data.email);
      setContactNumber(data.contactNumber);
      setWebsite(data.website);
      setCompanyLogo(data.companyLogo);
      setDescription(data.description);
    } catch (err) {
      console.log(err);
    }
  };

  return {
    name,
    address,
    email,
    contactNumber,
    website,
    companyLogo,
    description,
    id,
    setId,
    setName,
    setAddress,
    setEmail,
    setContactNumber,
    setWebsite,
    setCompanyLogo,
    setDescription,
  };
};

export default useSettings;
