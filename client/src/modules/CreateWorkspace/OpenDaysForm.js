import React from "react";
import TimePicker from "react-time-picker";

const daysCheckBox = [
  { dayName: "sunday" },
  { dayName: "monday" },
  { dayName: "tuesday" },
  { dayName: "wednesday" },
  { dayName: "thursday" },
  { dayName: "friday" },
  { dayName: "saturday" },
];

const OpenDaysForm = ({
  workspace,
  HandleChangeOpeningDays,
  handleOpeningHour,
  handleClosingHour,
}) => {
  return (
    <div>
      <div className="pt-10">
        {daysCheckBox.map((day, index) => {
          return (
            <div key={day.dayName}>
              <label className="label cursor-pointer">
                <a className="label-text text-primary text-lg font-medium">
                  {day.dayName}
                </a>
                <input
                  type="checkbox"
                  checked={workspace.opening_days[index].open}
                  id={index.toString()}
                  onChange={HandleChangeOpeningDays}
                  className="checkbox checkbox-primary"
                />
              </label>

              {workspace.opening_days[index].open && (
                <label className="label cursor-pointer justify-start">
                  <a className="label-text font-medium text-secondary text-base">
                    opening hours:
                  </a>
                  <div className="ml-5">
                    <TimePicker
                      onChange={(value) => handleOpeningHour(index, value)}
                      value={workspace.opening_days[index].opening_hour}
                    />{" "}
                    -
                    <TimePicker
                      onChange={(value) => handleClosingHour(index, value)}
                      value={workspace.opening_days[index].closing_hour}
                    />
                  </div>
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpenDaysForm;
