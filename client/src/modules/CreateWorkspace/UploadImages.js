import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';

const UploadImages = ({ workspace, handlePhotoUpload, handleImageDelete }) => {
  return (
    <div>
      <div className="flex flex-row flex-wrap justify-center mt-10">
        {workspace.photos?.map((photo, index) => {
          return (
            <div class="mask w-44 h-44 mb-8 mr-5" key={index}>
                <img className="h-36" src={photo} />
                <button className="btn btn-circle" onClick={() => {handleImageDelete(index)}}>
                    <DeleteIcon />
                </button>
          </div>
        )})}
      </div>

      <input
        id="photos"
        type="file"
        label="Photo"
        name="photo"
        multiple="multiple"
        accept=".jpeg, .png, .jpg"
        onChange={handlePhotoUpload}
        hidden
      />
      <label
        htmlFor="photos"
        id="button"
        class="mt-10 rounded-sm px-3 py-1 btn btn-primary focus:shadow-outline focus:outline-none"
      >
        Upload photos
      </label>
    </div>
  );
};

export default UploadImages;
