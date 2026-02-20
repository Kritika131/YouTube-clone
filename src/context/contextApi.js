import React, {createContext, useState, useEffect, useCallback} from 'react'
import {fetchDataFromApi} from '../utils/api';

export const Context = createContext();

export const AppContext = (props)=>{
   const [loading, setLoading] = useState(false);
   const [loadingMore, setLoadingMore] = useState(false);
   const [searchResults, setSearchResults] = useState([]);
   const [continuation, setContinuation] = useState(null);
   const [error, setError] = useState(null);
   const [selectCategories, setSelectCategories] = useState("New");
   const [mobileMenu, setMobileMenu] = useState(false);

   useEffect(()=>{
      fetchSelectedCategoryData(selectCategories)
   },[selectCategories]);

   const fetchSelectedCategoryData=(query)=>{
       setLoading(true);
       setError(null);
       setContinuation(null);
       fetchDataFromApi(`search/?q=${query}`).then((res)=>{
        setSearchResults(res?.contents || []);
        setContinuation(res?.continuation || null);
        setLoading(false);
       }).catch(()=>{
        setError("Failed to load videos. Please try again.");
        setLoading(false);
       })
   }

   const loadMoreResults = useCallback(()=>{
     if(loadingMore || !continuation) return;
     setLoadingMore(true);
     fetchDataFromApi(`search/?q=${selectCategories}&continuation=${continuation}`).then((res)=>{
       setSearchResults(prev => [...prev, ...(res?.contents || [])]);
       setContinuation(res?.continuation || null);
       setLoadingMore(false);
     }).catch(()=>{
       setLoadingMore(false);
     })
   },[continuation, loadingMore, selectCategories]);

   return (
    <Context.Provider value={{
        loading,
        setLoading,
        loadingMore,
        searchResults,
        continuation,
        loadMoreResults,
        setSelectCategories,
        selectCategories,
        mobileMenu,
        setMobileMenu,
        error,
    }}>
        {props.children}
    </Context.Provider>
   )
}