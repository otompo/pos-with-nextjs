import React, { useEffect, useState } from 'react';
import { Avatar, Spin, Progress, Image } from 'antd';
import Link from 'next/link';
import { SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/router';

const ManageEditProduct = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [values, setValues] = useState({
    name: '',
    price: '',
    quantity: '',
    batchId: '',
    tax: '',
    expireDate: '',
    discount: '',
    loading: false,
  });

  const [uploadButtonText, setUploadButtonText] = useState(
    'Upload product Image',
  );
  var preData = moment(values.expireDate).format('MMM Do Y');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ok, setOk] = useState(false);
  const [expireDate, setExpireDate] = useState(Date(preData).toDateString);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState([]); // categories
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  const [totalExpire, setTotalExpire] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  // console.log('selectedCategory', selectedCategory);
  // console.log('checked', checked);

  useEffect(() => {
    loadSingleProducts();
    loadCategories();
    // setSelectedCategory(checked);
  }, [slug]);

  const loadSingleProducts = async () => {
    try {
      const { data } = await axios.get(`/api/admin/products/edit/${slug}`);
      setValues(data);
      setCategoriesArray(data.category);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await axios.get(`/api/admin/category`);
      setCategories(data.category);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOk(true);
      setValues({
        ...values,
        loading: true,
      });
      const { data } = await axios.put(`/api/admin/products/edit/${slug}`, {
        name: values.name,
        price: values.price,
        quantity: values.quantity,
        batchId: values.batchId,
        tax: values.tax,
        discount: values.discount,
        selectedCategory: checked,
        expireDate,
        // image,
        // discountPrice,
      });
      toast.success('Success');
      router.push('/admin/products');
      setOk(false);
    } catch (err) {
      console.log(err.response.data.message);
      // toast.error(err.response.data.message);
      setOk(false);
      //   setValues({
      //     ...values,
      //     name: '',
      //     price: '',
      //     quantity: '',
      //     batchId: '',
      //     expireDate: '',
      //     tax: '',
      //     discount: '',
      //     loading: false,
      //   });
    }
  };

  const setCategoriesArray = (blogCategories) => {
    let ca = [];
    blogCategories.map((c, i) => {
      ca.push(c._id);
    });
    setChecked(ca);
  };

  const handleToggle = (c) => () => {
    // return the first index or -1
    const clickedCategory = checked.indexOf(c);
    const all = [...checked];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    // console.log(all);
    setChecked(all);
    setSelectedCategory(all);
    // formData.set('categories', all);
  };

  const findOutCategory = (c) => {
    const result = checked.indexOf(c);

    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToggle(c._id)}
            type="checkbox"
            checked={findOutCategory(c._id)}
            className="mr-2"
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const handleImage = async (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    setUploadButtonText(file.name);
    setImagePreview(window.URL.createObjectURL(file));
    const imageData = new FormData();
    imageData.append('image', file);
    // resize image and send image to backend
    try {
      let { data } = await axios.post(`/api/upload/image`, imageData);
      // set image in the state
      setImage(data);
      setLoading(false);
      setUploadButtonText('Upload Image');
      toast.success('Success');
    } catch (err) {
      console.log(err.response.data.message);
      setUploadButtonText('Upload Image');
      setLoading(false);
    }
  };

  return (
    <Layout title={slug}>
      <AdminRoute>
        <div className="container-fluid ourWorks">
          <div className="row my-3">
            <div className="col-md-6">
              <h1 className="lead">Manage {values.name}</h1>
            </div>
            <div className="col-md-4 offset-md-2 flost-left">
              <h1 className="lead">Discount Price </h1>
              <h4>
                GH &#x20B5;
                {values.price - (values.price * values.discount) / 100}
                .00
              </h4>
            </div>
          </div>
          <hr />
          <div className="row mx-3">
            <div className="col-md-6">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    className="form-control mb-4 p-2"
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="quantity"
                    value={values.quantity}
                    onChange={handleChange}
                    className="form-control mb-4 p-2"
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="price"
                    value={values.price}
                    onChange={handleChange}
                    className="form-control mb-4 p-2"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    name="discount"
                    value={values.discount}
                    onChange={handleChange}
                    className="form-control mb-4 p-2"
                    placeholder="Enter product discount  %"
                    required
                    min={0}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    name="tax"
                    value={values.tax}
                    onChange={handleChange}
                    className="form-control mb-4 p-2"
                    placeholder="Enter product tax"
                    required
                    min={0}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="batchId"
                    value={values.batchId}
                    onChange={handleChange}
                    className="form-control mb-4 p-2"
                    placeholder="Enter batch number"
                    required
                  />
                </div>

                <div className="form-group">
                  <DatePicker
                    className="w-100"
                    selected={expireDate}
                    onChange={(date) => setExpireDate(date)}
                    // minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    value={expireDate ? expireDate : preData}
                    isClearable
                    placeholderText="I have been cleared!"
                  />
                </div>

                {/* 
               

                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label className="btn btn-dark btn-block text-left mt-3 text-center">
                        {loading ? (
                          <span className="spinLoader">
                            <Spin />
                          </span>
                        ) : (
                          `${uploadButtonText}`
                        )}

                        <input
                          type="file"
                          name="image"
                          size="large"
                          onChange={handleImage}
                          accept="image/*"
                          hidden
                        />
                      </label>
                    </div>
                  </div>
                  <div className="col-md-2 my-3">
                    <div className="form-group">
                      {imagePreview ? (
                        <Avatar size={35} src={imagePreview} />
                      ) : (
                        <Avatar
                          size={50}
                          src={<Image src={values.imagePath} size={50} />}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  {progress > 0 && (
                    <Progress
                      className="d-flex justify-content-center pt-2"
                      percent={progress}
                      steps={10}
                    />
                  )}
                </div> */}

                <div className="d-grid gap-2 my-2 ">
                  <button
                    className="btn btn-primary"
                    disabled={
                      !values.name ||
                      !values.price ||
                      !values.batchId ||
                      !expireDate ||
                      loading
                    }
                    type="submit"
                  >
                    {ok ? <Spin /> : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
            <div className="col-md-6">
              <h1 className="lead  ml-5">Categories</h1>
              <hr />
              <ul>{showCategories()}</ul>
              <hr />
            </div>
          </div>
        </div>

        {/* <pre>{JSON.stringify(values, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManageEditProduct;
