import CreateCategoryForm from '../forms/CreateCategoryForm';

const AddCategory = ({
  handleChange,
  setSuccess,
  handleSubmit,
  success,
  values,
}) => {
  return (
    <div>
      <CreateCategoryForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        values={values}
      />
    </div>
  );
};

export default AddCategory;
