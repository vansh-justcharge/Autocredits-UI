import React from 'react';
import { useFormContext } from '../../contexts/FormContext';
import { useNavigate } from 'react-router-dom';

const Inspection = () => {
  const { form, updateForm } = useFormContext();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    updateForm({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard/insurance-case/Previous-Policy-Details");
  };

  return (
    <div>
      <div className='w-full p-6'>
        <h1 className='text-2xl font-semibold'>Inspection</h1>
        <form className='p-6' onSubmit={handleSubmit}>
          <div className='flex w-full mb-12'>
            <div className='w-full'>
              <label className='block text-sm font-semibold mb-2'>Inspection Status</label>
              <select
                name='inspectionStatus'
                className='bg-gray-100 rounded py-2 px-3 border border-gray-200 w-full text-gray-700'
                value={form.inspectionStatus || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
            <div className='w-full ml-6 '>
              <label className='block text-sm font-semibold mb-2'>Reference Number</label>
              <input
                name='inspectionReferenceNo'
                type='number'
                placeholder='Enter Reference Number'
                value={form.inspectionReferenceNo || ''}
                onChange={handleChange}
                className='px-3 py-2 text-gray-700 bg-gray-100 border border-gray-200  w-full rounded'
                required
              />
            </div>
          </div>
          <div className='w-full '>
            <label className='block text-sm font-semibold mb-2'>Comment </label>
            <input
              name='inseptionComment'
              type='text'
              placeholder='Comment'
              value={form.inseptionComment || ''}
              onChange={handleChange}
              className='px-3 py-2 text-gray-700  bg-gray-100 border border-gray-200  w-full rounded'
            />
          </div>
          <button
            type="submit"
            className='mt-16 w-full bg-black text-white px-6 py-2 text-[16px] rounded'
          >
            Save and Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inspection;
