import React from 'react';
import './CommentToolTip.css';
const CommentsTooltip = (props) => {
  if (!props.api || !props.data) {
    return null;
  }

  const { data } = props;
  let preInfo = data['pre_info'];

  // Function to sort comments by timestamp in reverse order
  const sortCommentsByTimestamp = (comments) => {
    return comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Sort preInfo array by timestamp in reverse order
  preInfo = Array.isArray(preInfo) ? sortCommentsByTimestamp(preInfo) : [];


  if (
    (Array.isArray(preInfo) && preInfo.length > 0) 
  ) {
    return (
      <div className="custom-tooltip">
        <div className="panel-heading">
          <h3 className="panel-title">Partition: {data.Partition_Name}</h3>
          <h3 className="panel-title">Lead: {data.Lead}</h3>
        </div>
        <div className="panel-body">
          <ul>
            {Array.isArray(preInfo) && preInfo.length > 0 && (
              <li>
                Previous Comments:
                <ul>
                  {preInfo.map((comment, index) => (
                    <li key={index}>
                    {comment.user}-{comment.timestamp}: {comment.comment}
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default CommentsTooltip;