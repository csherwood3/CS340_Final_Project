function deleteItem(path, id) {
  $.ajax({
    url:`/${path}/` + id,
    type: 'DELETE',
    success: function(response) {
      const data = JSON.parse(response);
      if (data.error) {
        alert(data.error);
      } else {
        window.location.reload(true);
      }
    }
  });
};

function deleteCourseStudentRel(course_id, student_id) {
  $.ajax({
    url:`/courses-students?course_id=${course_id}&student_id=${student_id}`,
    type: 'DELETE',
    success: function(response) {
      const data = JSON.parse(response);
      if (data.error) {
        alert(data.error);
      } else {
        window.location.reload(true);
      }
    }
  });
};

function updateItem(path, id) {
    $.ajax({
        url: `/${path}/` + id,
        type: 'PUT',
        data: $('#update-form').serialize(),
        success: function(response) {
          const data = JSON.parse(response);
          if (data.error) {
            alert(data.error);
          } else {
            window.location.replace(`/${path}`);
          }
        }
    })
};

$(document).ready( function() {
  $('#update-form').on('submit', function(e) {
    e.preventDefault();
    updateItem($('#update-item-path').val(), $('#update-item-id').val());
  });  
});
