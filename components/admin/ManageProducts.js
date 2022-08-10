import React, { useEffect, useState } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Avatar, Spin, Modal, Progress, Badge, Button, Tooltip } from 'antd';
import download from 'downloadjs';
import Link from 'next/link';
import {
  DeleteOutlined,
  EditOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  RedoOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import AdminRoute from '../routes/AdminRoutes';
import Layout from '../layout/Layout';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Loader from '../layout/Loader';
import FormatCurrency from '../FormatCurrency';
const { confirm } = Modal;

const ManageProducts = () => {
  const [values, setValues] = useState({
    name: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    loading: false,
  });
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ok, setOk] = useState(false);
  const [expireDate, setExpireDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState([]); // categories
  const [csvFile, setCsvFile] = useState([]);
  const [file, setFile] = useState('');
  const [totalInStock, setTotalInStock] = useState('');
  const [totalAboutOutStock, setTotalAboutOutStock] = useState('');
  const [totalOutOfStock, setTotalOutOfStock] = useState('');
  const [totalAboutToExpire, setTotalAboutToExpire] = useState('');
  const [totalExpire, setTotalExpire] = useState('');
  const [tempData, setTempData] = useState([]);
  const [actionTriggered, setActionTriggered] = useState('');
  const [quantity, setQuantity] = useState('');
  let currentQty = tempData[1];

  // console.log('file', file.name);

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
        // sellingPrice,
      });
      toast.success('Success');
      setValues({
        ...values,
        name: '',
        sellingPrice: '',
        costPrice: '',
        quantity: '',
        loading: false,
      });
      setSuccess(false);
      setOk(false);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
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

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const processCSV = (string, delim = ',') => {
      const csvHeader = string.slice(0, string.indexOf('\r\n')).split(delim);
      const csvRows = string.slice(string.indexOf('\n') + 1).split('\r\n');
      // console.log(csvHeader);
      // console.log(csvRows);
      const array = csvRows.map((i) => {
        const values = i.split(',');
        const obj = csvHeader.reduce((object, header, index) => {
          object[header] = values[index];
          return object;
        }, {});
        return obj;
      });

      setCsvFile(array.slice(0, array.length - 1));
    };
    try {
      setValues({ ...values, loading: true });
      setOk(true);
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/importdata`, {
        csvFile,
      });
      toast.success('Data import Succcess');
      setFile('');
      setValues({
        ...values,
        name: '',
        sellingPrice: '',
        costPrice: '',
        quantity: '',
        loading: false,
      });
      setSuccess(false);
      setOk(false);
    } catch (err) {
      console.log(err);
      setSuccess(false);
      setOk(false);
    }
    var fileReader = new FileReader();
    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        processCSV(text);
      };
      fileReader.readAsText(file);
    }
  };

  const loadEditQtyData = (name, slug, quantity) => {
    let tempData = [name, quantity, slug];
    setTempData((item) => [...tempData]);
    // console.log(tempData);
    return showModal();
  };

  const handleQuantityRestock = async (e) => {
    e.preventDefault();

    try {
      setSuccess(true);
      const { data } = await axios.put(
        `/api/admin/products/outofstock/update/${tempData[2]}`,
        {
          quantity,
          currentQty,
        },
      );
      toast.success('Success');
      setQuantity('');
      setSuccess(false);
      setIsModalVisible(false);
    } catch (err) {
      toast.error(err.response.data);
      setSuccess(false);
      setQuantity('');
    }
  };

  const setData = () => {
    const data = {
      columns: [
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
          label: 'Cost Price',
          field: 'costprice',
          sort: 'asc',
        },
        {
          label: 'Selling Price',
          field: 'sellingPrice',
          sort: 'asc',
        },
        {
          label: 'Expire Date',
          field: 'expireDate',
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
          name: `${product.name}`,
          category: `${
            product &&
            product.category &&
            product.category.map((c, i) => `${c && c.name}`)
          }`,
          quantity: `${product.quantity}`,
          costprice: `${FormatCurrency(Number(product.costPrice))}`,
          sellingPrice: `${FormatCurrency(product.sellingPrice)}`,
          expireDate: `${moment(product.expireDate).fromNow()}`,
          createdat: `${moment(product.createdAt).fromNow()}`,
          action: (
            <>
              <div className="container">
                <div className="row">
                  <Tooltip title={`Edit ${product.name}`} color="green">
                    <div className="col-md-4">
                      <Link href={`/admin/products/${product.slug}`}>
                        <a>
                          <EditOutlined
                            className="text-success d-flex justify-content-center"
                            style={{ cursor: 'pointer', fontSize: 25 }}
                          />
                        </a>
                      </Link>
                    </div>
                  </Tooltip>
                  <div className="col-md-4">
                    <Tooltip title={`Restock ${product.name}`} color="blue">
                      <span
                        onClick={() => {
                          loadEditQtyData(
                            product.name,
                            product.slug,
                            product.quantity,
                          );
                          setActionTriggered('ACTION_2');
                        }}
                        // className="pt-1 pl-3"
                      >
                        <RedoOutlined
                          className="text-primary d-flex justify-content-center"
                          style={{ cursor: 'pointer', fontSize: 25 }}
                        />
                      </span>
                    </Tooltip>
                  </div>
                  <div className="col-md-4">
                    <Tooltip title={`Delete ${product.name}`} color="red">
                      <span
                        onClick={() => handleDelete(index)}
                        // className="pt-1 pl-3"
                      >
                        <DeleteOutlined
                          className="text-danger d-flex justify-content-center"
                          style={{ cursor: 'pointer', fontSize: 25 }}
                        />
                      </span>
                    </Tooltip>
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
          <div className="row  m-4">
            <div className="col-md-2">
              <Link href="/admin/products/instock">
                <a>
                  <div className="containerItems">
                    <div className="content">
                      <h4>Instock</h4>
                      <p>{totalInStock && totalInStock} </p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
            <div className="col-md-2">
              <Link href="/admin/products/aboutofstock">
                <a>
                  <div className="containerItems">
                    <div className="content">
                      <h4>About to out Stock</h4>
                      <p>{totalAboutOutStock && totalAboutOutStock} </p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
            <div className="col-md-2">
              <Link href="/admin/products/outofstock">
                <a>
                  <div className="containerItems">
                    <div className="content">
                      <h4>Out Stock</h4>
                      <p>{totalOutOfStock && totalOutOfStock} </p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
            <div className="col-md-2">
              <Link href="/admin/products/abouttoexpire">
                <a>
                  <div className="containerItems">
                    <div className="content">
                      <h4> About to Expire</h4>
                      <p>{totalAboutToExpire && totalAboutToExpire}</p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
            <div className="col-md-2">
              <Link href="/admin/products/expired">
                <a>
                  <div className="containerItems">
                    <div className="content">
                      <h4>Expired</h4>
                      <p>{totalExpire && totalExpire}</p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </div>
          <hr />
          <div className="row m-4">
            <div className="col-md-3 offset-md-2 ">
              <p
                className="btn text-white  btn-success block"
                onClick={() => {
                  setIsModalVisible(true);
                  setActionTriggered('ACTION_1');
                }}
              >
                {' '}
                ADD PRODUCT
              </p>
            </div>
            <div className="col-md-3">
              <form>
                <label className="btn btn-primary text-center ">
                  {file && file ? file.name : '  SELECT CSV FILE'}

                  <input
                    type="file"
                    id="csvFile"
                    accept=".csv"
                    onChange={handleOnChange}
                    hidden
                  />
                </label>
                <button
                  className="btn btn-info"
                  type="primary"
                  onClick={(e) => {
                    handleOnSubmit(e);
                  }}
                  style={{ marginLeft: 10 }}
                >
                  SUBMIT
                </button>
              </form>
            </div>

            <div className="col-md-3">
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
        <Modal
          title={
            actionTriggered == 'ACTION_1' ? (
              <span>Add Product</span>
            ) : (
              <>
                {' '}
                <span>Restock {tempData[0]} Quantity</span>
                <br />
                <span className="lead">Current Quantity is {tempData[1]}</span>
              </>
            )
          }
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={actionTriggered == 'ACTION_1' ? 900 : 500}
        >
          {actionTriggered == 'ACTION_1' ? (
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
                      name="costPrice"
                      value={values.costPrice}
                      onChange={handleChange}
                      className="form-control mb-4 p-2"
                      placeholder="Enter cost price"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="sellingPrice"
                      value={values.sellingPrice}
                      onChange={handleChange}
                      className="form-control mb-4 p-2"
                      placeholder="Enter selling price"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label for="expireDate">Expire Date</label>
                    <DatePicker
                      id="expireDate"
                      className="w-100"
                      selected={expireDate}
                      onChange={(date) => setExpireDate(date)}
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy"
                      isClearable
                      placeholderText="I have been cleared!"
                    />
                  </div>

                  <div className="d-grid gap-2 my-2 ">
                    <button
                      className="btn btn-primary"
                      disabled={
                        !values.name ||
                        !values.costPrice ||
                        !values.sellingPrice ||
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
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-12">
                <form onSubmit={handleQuantityRestock}>
                  <div className="form-group">
                    <input
                      type="number"
                      // name="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="form-control mb-4 p-2"
                      placeholder="Enter quantity"
                      required
                    />
                  </div>

                  <div className="d-grid gap-2 my-2 ">
                    <button
                      className="btn btn-primary"
                      // disabled={!values.name || loading}
                      type="submit"
                    >
                      {/* {ok ? <SyncOutlined spin /> : 'Submit'} */}
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Modal>
      </AdminRoute>
    </Layout>
  );
};

export default ManageProducts;
