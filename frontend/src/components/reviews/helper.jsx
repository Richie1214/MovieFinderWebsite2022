const filterFunction = (filter, filterReviews) => {
  if (filter === "new") {
    return filterReviews.sort(
      (a, b) => {
        const [day1, month1, year1] = a.date.split('/');
        const [day2, month2, year2] = b.date.split('/');
        const date1 = new Date(year1, month1 - 1, day1);
        const date2 = new Date(year2, month2 - 1, day2);
        return date1 > date2 ? -1 : 1;
      }
    );
  } else if (filter === "old") {
    return filterReviews.sort(
      (a, b) => {
        const [day1, month1, year1] = a.date.split('/');
        const [day2, month2, year2] = b.date.split('/');
        const date1 = new Date(year1, month1 - 1, day1);
        const date2 = new Date(year2, month2 - 1, day2);
        return date1 > date2 ? 1 : -1;
      }
    );
  } else if (filter === "high") {
    return filterReviews.sort(
      (a, b) => {
        return b.rating - a.rating;
      }
    );
  } else {
    return filterReviews.sort(
      (a, b) => {
        return a.rating - b.rating;
      }
    );
  }
}

const deleteLink = (index, hyperlinks, setHyperlinks) => {
  hyperlinks.splice(index, 1);
  const newHyperlinks = [...hyperlinks];
  setHyperlinks(newHyperlinks);
}

export {filterFunction, deleteLink}