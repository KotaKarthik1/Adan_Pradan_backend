t newArray = workshopstosend.map(item => ({
  heading: `${item._id} - ${new Date(item.Date).toDateString()}`,
  workshops: item.workshops.map(workshop => ({
    workshopName: workshop.workshopTitle,
    date: new Date(workshop.Date).toDateString(),
    students: item.studentdetails.map(student => ({
      name: student.name,
      collegeName: student.collegeName
    }))
  }))
}));