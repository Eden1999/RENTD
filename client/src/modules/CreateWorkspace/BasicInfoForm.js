import React, { useState, useCallback, useContext, useEffect } from "react";

const BasicInfoForm = ({ setWorkspace, editProps, workspace, spaceTypes }) => {
    return (
        <div>
            <div className="mb-6">
              <label className="block mb-2 text-lg font-medium text-primary">
                Name:
              </label>
              <input
                className="input input-bordered select-lg font-normal w-full text-secondary"
                value={workspace.name}
                onChange={(event) => {
                  setWorkspace((workspace) => ({
                    ...workspace,
                    name: event.target.value,
                  }));
                }}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-lg font-medium text-primary">
                City:
              </label>
              <input
                className="input input-bordered select-lg font-normal w-full text-secondary"
                type="city"
                id="city"
                {...editProps.city}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-lg font-medium text-primary">
                Address:
              </label>
              <input
                className="input input-bordered 2xl:select-lg font-normal w-full text-secondary"
                type="address"
                id="address"
                disabled={!workspace.city}
                {...editProps.address}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-lg font-medium text-primary">
                Description:
              </label>
              <textarea
                className="textarea textarea-bordered 2xl:select-lg font-normal w-full text-secondary h-32"
                value={workspace.description}
                onChange={(event) => {
                  setWorkspace((workspace) => ({
                    ...workspace,
                    description: event.target.value,
                  }));
                }}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-lg font-medium text-primary">
                Environment:
              </label>
              <select
                className="select select-bordered select-lg mb-2 font-medium w-full text-primary"
                onChange={(event, value) => {
                  setWorkspace((workspace) => ({
                    ...workspace,
                    spaceType: value,
                  }));
                }}
              >
                {spaceTypes.map((item, index) => (
                  <option value={index} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
    )
}

export default BasicInfoForm;
