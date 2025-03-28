import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, Image } from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import { updateSearchCount } from "@/services/appwrite";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: movies = [],
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Debounce the search query to avoid excessive API calls
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Update the search count in Appwrite
  useEffect(() => {

    if (movies?.length > 0 && movies[0]?.id) {
      updateSearchCount(searchQuery, movies[0]);
    }
  }, [movies]);

  return (
    <View className="flex-1 bg-primary" >
      {/* Background Image */}
      <Image source={images.bg} style={{ position: "absolute", width: "100%", height: "100%" }} />

      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard {...item} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        className="px-5"
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}

        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center">
              <Image source={icons.logo2} className="w-12 h-10 self-center mt-5" />
            </View>

            <View className="my-5">
              <SearchBar placeholder="Search for movies"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {loading && <ActivityIndicator size="large" color="#f2bd29" className="my-3" />}

            {error && <Text className="text-red-600 text-center px-5 my-3">{error?.message || "Something went wrong"}</Text>}

            {!loading && !error && movies?.length > 0 && searchQuery.trim() && (
              <Text className="text-white text-xl font-bold">
                Search results for {" "}
                <Text className="text-light-400 ">{searchQuery}</Text>
              </Text>
            )}
          </>
        }

        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-light-400 text-center font-semibold text-lg">
                {searchQuery.trim() ? `No results found for "${searchQuery}"` : "Search for a movie..."}
              </Text>
            </View>

          ) : null
        }
      />
    </View>
  )
}

export default Search