import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Avatar, Spin, Modal, Progress, Badge, Button, Upload } from 'antd';
import download from 'downloadjs';
import Link from 'next/link';
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from '../layout/Loader';
const { confirm } = Modal;

const ManageProducts = () => {
  const [values, setValues] = useState({
    name: '',
    price: '',
    quantity: '',
    batchId: '',
    tax: '',
    discount: '',
    loading: false,
  });
  const [products, setProducts] = useState([]);
  const [uploadButtonText, setUploadButtonText] = useState(
    'Upload product Image',
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ok, setOk] = useState(false);
  const [expireDate, setExpireDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState([]); // categories
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState('/img/preview.ico');
  const [csvFile, setCsvFile] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [totalInStock, setTotalInStock] = useState('');
  const [totalAboutOutStock, setTotalAboutOutStock] = useState('');
  const [totalOutOfStock, setTotalOutOfStock] = useState('');
  const [totalAboutToExpire, setTotalAboutToExpire] = useState('');
  const [totalExpire, setTotalExpire] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    showProducts();
    loadCategories();
    loadTotalInStock();
    loadTotalAboutOutOfStock();
    loadTotalOutOfStock();
    loadTotalAboutToExpire();
    loadTotalExpired();
    // setDiscountPrice(values.price - (values.price * values.discount) / 100);
  }, [success]);

  const loadTotalInStock = async () => {
    try {
      const { data } = await axios.get(`/api/admin/products/instock`);
      setTotalInStock(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTotalAboutOutOfStock = async () => {
    try {
      const { data } = await axios.get(`/api/admin/products/aboutoutstock`);
      setTotalAboutOutStock(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTotalOutOfStock = async () => {
    try {
      const { data } = await axios.get(`/api/admin/products/outofstock`);
      setTotalOutOfStock(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTotalAboutToExpire = async () => {
    try {
      const { data } = await axios.get(
        `/api/admin/products/productsabouttoexpired`,
      );
      setTotalAboutToExpire(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTotalExpired = async () => {
    try {
      const { data } = await axios.get(`/api/admin/products/expired`);
      setTotalExpire(data.total);
    } catch (err) {
      console.log(err);
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

  const showProducts = async () => {
    try {
      setValues({ ...values, loading: true });
      const { data } = await axios.get(`/api/admin/products`);
      setProducts(data.products);
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
      setValues({ ...values, loading: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setValues({ ...values, loading: true });
      setOk(true);
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/products`, {
        ...values,
        selectedCategory,
        expireDate,
        image,
        // discountPrice,
      });
      toast.success('Success');
      setValues({
        ...values,
        name: '',
        price: '',
        batchId: '',
        quantity: '',
        tax: '',
        discount: '',
        loading: false,
      });
      setImagePreview('');
      setImage({});
      setSuccess(false);
      setOk(false);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
      // setValues({
      //   ...values,
      //   name: '',
      //   price: '',
      //   batchId: '',
      //   quantity: '',
      //   tax: '',
      //   discount: '',
      //   loading: false,
      // });
      setSuccess(false);
      setOk(false);
    }
  };

  const handleDelete = (index) => {
    confirm({
      title: `Are you sure delete`,
      icon: <ExclamationCircleOutlined />,
      content: 'It will be deleted permanentily if you click Yes',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',

      onOk: async () => {
        try {
          //   const answer = window.confirm('Are you sure you want to delete?');
          //   if (!answer) return;
          setLoading(true);
          let allProducts = products;
          const removed = allProducts.splice(index, 1);
          // console.log('removed', removed[0]._id);
          setProducts(allProducts);
          // send request to server
          const { data } = await axios.delete(
            `/api/admin/products/${removed[0]._id}`,
          );
          // console.log('LESSON DELETED =>', data);
          toast.success('Product Deleted Successfully');
          setLoading(false);
        } catch (err) {
          toast.error(err.response.data.message);
          setLoading(false);
        }
      },
      onCancel() {
        return;
      },
    });
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

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToggle(c._id)}
            type="checkbox"
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
  const handleDataExport = async () => {
    try {
      const res = (
        await axios.get(`/api/admin/exportdata`, {
          responseType: 'blob',
        })
      ).data;
      if (res) {
        download(res, new Date().toLocaleDateString() + '-data.csv');
      } else {
        alert('Data not found');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDataImport = async () => {
    try {
      const { data } = await axios.post(`/api/admin/importdata`);
      toast.success('Data import Succcess');
    } catch (err) {
      console.log(err);
    }
  };

  const setData = () => {
    const data = {
      columns: [
        {
          label: 'Image',
          field: 'image',
          sort: 'asc',
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Category',
          field: 'category',
          sort: 'asc',
        },
        {
          label: 'Quantity',
          field: 'quantity',
          sort: 'asc',
        },
        {
          label: 'Unit Price',
          field: 'price',
          sort: 'asc',
        },
        {
          label: 'Discount Price',
          field: 'discountPrice',
          sort: 'asc',
        },
        {
          label: 'Expire Date',
          field: 'expireDate',
          sort: 'asc',
        },
        {
          label: 'Discount',
          field: 'discount',
          sort: 'asc',
        },
        {
          label: 'Tax',
          field: 'tax',
          sort: 'asc',
        },
        {
          label: 'Created At',
          field: 'createdat',
          sort: 'asc',
        },

        {
          label: 'Action',
          field: 'action',
          sort: 'asc',
        },
      ],
      rows: [],
    };

    products &&
      products.forEach((product, index) => {
        data.rows.push({
          image: <Avatar size={30} src={product && product.imagePath} />,
          name: `${product.name}`,
          category: `${
            product &&
            product.category &&
            product.category.map((c, i) => `${c && c.name}`)
          }`,
          quantity: `${product.quantity}`,
          price: `GHS ${product.price}.00`,
          discountPrice: `GHS ${product.discountPrice}.00`,
          expireDate: `${moment(product.expireDate).fromNow()}`,
          discount: `${product.discount}`,
          tax: `${product.tax}`,
          createdat: `${moment(product.createdAt).fromNow()}`,

          action: (
            <>
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <Link href={`/admin/products/${product.slug}`}>
                      <a>
                        <EditOutlined
                          className="text-success d-flex justify-content-center"
                          style={{ cursor: 'pointer', fontSize: 20 }}
                        />
                      </a>
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <span
                      onClick={() => handleDelete(index)}
                      // className="pt-1 pl-3"
                    >
                      <DeleteOutlined
                        className="text-danger d-flex justify-content-center"
                        style={{ cursor: 'pointer', fontSize: 20 }}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </>
          ),
        });
      });

    return data;
  };

  return (
    <Layout title="Manage Products">
      <AdminRoute>
        <div className="container-fluid ourWorks">
          <div className="row m-4">
            <div className="col-md-10">
              <div className="row">
                <div className="col-md-3">
                  <Link href="/admin/products/instock">
                    <a className="btn text-white  button  mt-2">Instock</a>
                  </Link>
                  <Badge count={totalInStock && totalInStock} />
                </div>
                <div className="col-md-3">
                  <Link href="/admin/products/aboutofstock">
                    <a className="btn text-white  button mt-2">
                      {' '}
                      About to out Stock
                    </a>
                  </Link>
                  <Badge count={totalAboutOutStock && totalAboutOutStock} />
                </div>
                <div className="col-md-3">
                  <Link href="/admin/products/outofstock">
                    <a className="btn text-white  button mt-2"> Out of Stock</a>
                  </Link>
                  <Badge count={totalOutOfStock && totalOutOfStock} />
                </div>
                <div className="col-md-3">
                  <Link href="/admin/products/abouttoexpire">
                    <a className="btn text-white  button mt-2">
                      {' '}
                      About to Expire
                    </a>
                  </Link>
                  <Badge count={totalAboutToExpire && totalAboutToExpire} />
                </div>

                <div className="col-md-3">
                  <Link href="/admin/products/expired">
                    <a className="btn text-white  button mt-2"> Expired</a>
                  </Link>
                  <Badge count={totalExpire && totalExpire} />
                </div>
                <div className="col-md-3 my-3 exportData">
                  <Button
                    type="primary"
                    shape="round"
                    icon={<UploadOutlined size={35} />}
                    size={35}
                    onClick={() => {
                      handleDataExport();
                    }}
                  >
                    EXPORT CSV DATA
                  </Button>
                </div>
                <div className="col-md-3 my-3 exportData">
                  {/* <form onSubmit={handleDataImport}>
                    <label className="btn btn-primary text-center">
                      IMPORT CSV DATA
                      <input
                        type="file"
                        name="csvFile"
                        size="large"
                        onChange={(e) => setCsvFile(e.target.value)}
                        accept="csv/*"
                        hidden
                      />
                    </label>
                    <button type="submit" shape="round">
                      Submit
                    </button>
                  </form> */}

                  <Button
                    type="primary"
                    shape="round"
                    file="csv"
                    icon={<DownloadOutlined />}
                    onClick={() => {
                      handleDataImport();
                    }}
                  >
                    IMPORT CSV FILE
                  </Button>
                </div>
              </div>
            </div>

            <div className="col-md-2">
              <p
                className="btn text-white float-right btn-success mt-2"
                onClick={showModal}
              >
                {' '}
                Add Product
              </p>
            </div>
            <Modal
              title="Add Product"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={null}
              width={900}
            >
              <div className="row">
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
                        minDate={new Date()}
                        isClearable
                        placeholderText="I have been cleared!"
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
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
                      <div className="col-md-4 offset-md-2">
                        <div className="form-group mt-3">
                          {imagePreview ? (
                            <Avatar size={40} src={imagePreview} />
                          ) : (
                            <Avatar size={40} src="/img/preview.ico" />
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
                    </div>

                    {/* <div className="form-group">
                      <textarea
                        rows="7"
                        name="description"
                        style={{ width: '100%' }}
                        value={values.description}
                        onChange={handleChange}
                      ></textarea>
                    </div> */}

                    <div className="d-grid gap-2 my-2 ">
                      <button
                        className="btn btn-primary"
                        disabled={
                          !values.name ||
                          !values.price ||
                          !values.batchId ||
                          !values.discount ||
                          !values.tax ||
                          !expireDate ||
                          loading
                        }
                        type="submit"
                      >
                        {ok ? <SyncOutlined spin /> : 'Submit'}
                      </button>
                    </div>
                  </form>
                </div>
                <div className="col-md-6">
                  <h1 className="lead  ml-5">Categories</h1>
                  <hr />
                  <div className="row">
                    <div className="col-md-12">
                      <ul>{showCategories()}</ul>
                    </div>
                    {/* <div className="col-md-6">
                      <ul>{showCategoriesS()}</ul>
                    </div> */}
                  </div>

                  <hr />
                  <div className="row">
                    <div className="col-md-6">
                      <h1 className="lead">Discount Price </h1>
                    </div>
                    <div className="col-md-6">
                      <h4>
                        GH&#x20B5;
                        {values.price - (values.price * values.discount) / 100}
                        .00
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
        <hr />

        <MDBDataTable
          data={setData()}
          className="px-3"
          bordered
          striped
          hover
        />
        {/* <pre>{JSON.stringify(categories, null, 4)}</pre> */}
      </AdminRoute>
    </Layout>
  );
};

export default ManageProducts;
