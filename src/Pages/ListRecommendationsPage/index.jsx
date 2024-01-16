// Page for the particular list of user movies
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FilmCard } from "../../Components";
import { useNavigate } from "react-router-dom";
import "./ListRecommendationsPage.css";



const ListRecommendationsPage = () => {
  const { id } = useParams();

  const [list, setList] = useState([]);

  const navigate = useNavigate();
  
  useEffect(() => {

    const fetchListsById = async () => {
      try {
        const options = {
            method: 'GET',
            headers: {
                
                'Authorization': 'Bearer ' +localStorage.getItem("accessToken")
            }
        }
             
        const response = await fetch(`http://localhost:4000/recommendations_list/${id}`,options);
        const data = await response.json();
        console.log("After fetching Data");
        // console.log("Data=",data.movies[0].title);
        console.log("Data=",data);
        setList(data);
      } catch (error) {
        console.log("Error Fetching Data ",error);
      }
    };
   
    fetchListsById();
  }, []);

  const handleRecomend = async () => {
    try {
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem("accessToken")
        },
        // body: JSON.stringify({ title: newTitle }) 
      };

      const response = await fetch(`http://localhost:4000/recommendations_list_recommend/${id}`, options);
      window.location.reload();

    } catch (error) {
      console.log("Error recommending a movie", error);
    }
  };

  const handleSearch = () => {
    navigate(`/search/${id}`);
  };

const removeMovie = (movies_list, movie_index) => {
    const newMovieList=JSON.parse(JSON.stringify(movies_list))
    newMovieList.movies.splice(movie_index,1)
    newMovieList.movies_id.splice(movie_index,1)
    return newMovieList
};

// Deleteng movie from the list
  const handleDeleteFromList = async (id,movie_id) => {
    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("accessToken")
        },
      };
      
      const response = await fetch(`http://localhost:4000/recommendations_list_manage/${id}/${movie_id}`, options);
      console.log("response after deleting=", response)
      if (response.ok) {
        // Remove the deleted item from the list
        console.log("list.movies_id = ", list.movies_id)
        console.log("list.movies = ", list.movies)
        //const newList = JSON.parse(JSON.stringify(list));
        const movie_index = list.movies_id.indexOf(movie_id)
        //console.log("newList = ", newList)
        setList((prevList) => removeMovie(prevList, movie_index));

        //{title: prevList.title;
        //    movies_id: prevList.movies_id.filter(item => item.id !== movie_id);
        //    movies: prevList.movies.filter((value, index) => movie_index !== index)}

        console.log(`Movie with ID ${movie_id} deleted successfully`);
      } else {
        console.log(`Error deleting movie with ID ${movie_id} in the list ${id}`);
      }
    } catch (error) {
      console.log(`Error Deleting from List  ${id}`, error);
    }
  };


  return (
    <>
        <h2 className="white_h2">{list.title}</h2>



      {list.movies?.map((movie, index) => (
        <FilmCard
            key={index}  
            id={id}        
            movie_id={list.movies_id?.[index]}
            title={movie.title}
            onDelete={handleDeleteFromList}
            
        
        />
      ))}


      <button type="button" onClick={handleRecomend}>
          Recommend a movie
        </button>

      <button type="button" onClick={handleSearch}>
          Search a movie to add into the list
        </button>

    </>
  )
};

export default ListRecommendationsPage;
