import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Text, View, Image, ActivityIndicator, FlatList } from "react-native";
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";

export default function Index() {
  const router = useRouter();

  // Fetch trending movies using the custom `useFetch` hook
  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  // Fetch movies using the custom `useFetch` hook
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  // Function to handle search bar press
  return (
    <View style={{ flex: 1, backgroundColor: "#1a1a1a" }}>
      {/* Background Image */}
      <Image source={images.bg} style={{ position: "absolute", width: "100%", height: "100%" }} />

      {/* Show loading indicator while movies are being fetched */}
      {moviesLoading || trendingLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />

      ) : moviesError || trendingError ? (
        // Show error message if there is an error

        <Text style={{ color: "red", textAlign: "center", marginTop: 20 }}>
          Error: {moviesError?.message || trendingError?.message || "Something went wrong."}
        </Text>
      ) : (

        // Use FlatList to display movies
        <FlatList
          data={movies} // Pass the movies data to FlatList
          keyExtractor={(item) => item.id.toString()} // Ensure each item has a unique key
          numColumns={3} // Display movies in a grid with 3 columns
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 10,
            marginBottom: 50,
          }}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
          ListHeaderComponent={
            <>
              {/* Logo */}
              <Image source={icons.logo2} style={{ width: 50, height: 40, alignSelf: "center", marginTop: 20 }} />

              {/* Search Bar */}
              <View className="flex-1 mt-5">
                <SearchBar
                  onPress={() => {
                    router.push("/search");
                  }}
                  placeholder="Search for a movie"
                />

                {/* Trending Movies Section */}
                {trendingMovies && (
                  <View className="mt-10">

                    <Text className="text-white text-xl font-bold mb-3">
                      Trending Movies
                    </Text>

                    {/* Render each trending movie using the TrendingCard component */}
                    <FlatList className="flex-row gap-x-3"
                      data={trendingMovies}
                      keyExtractor={(item) => item.movie_id.toString()}
                      horizontal
                      ItemSeparatorComponent={() => <View className="w-4" />}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item, index }) => (
                        <TrendingCard movie={item} index={index} />
                      )}
                    />
                  </View>
                )}
              </View>

              {/* Latest Movies Section */}
              <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 }}>
                Latest Movies
              </Text>

              {/* No Movies Found */}
              {!movies || movies.length === 0 ? (
                <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>No movies found.</Text>
              ) : null}
            </>
          }
          renderItem={({ item }) => (
            // Render each movie using the MovieCard component
            <MovieCard {...item} />
          )}
        />
      )}
    </View>
  );
}