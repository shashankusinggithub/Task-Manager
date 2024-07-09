import React from "react";
import Task from "./Task";

const TaskList = ({ tasks, handleDelete, handleUpdate }) => {
  return (
    <div>
      {tasks.map((task) => (
        <Task
          key={task._id}
          task={task}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
        />
      ))}
    </div>
  );
};

export default TaskList;
