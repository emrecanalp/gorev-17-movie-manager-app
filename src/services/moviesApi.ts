import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Movie {
  id?: number;
  title: string;
  year: number;
  posterUrl?: string;
  genre: string;
  rating: number;
  description: string;
  duration: number;
}

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5174' }),
  tagTypes: ['Movies'],
  endpoints: (builder) => ({
    getMovies: builder.query<Movie[], void>({
      query: () => '/movies',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Movies' as const, id })),
              { type: 'Movies' as const, id: 'LIST' },
            ]
          : [{ type: 'Movies' as const, id: 'LIST' }],
    }),
    getMovie: builder.query<Movie, string | number>({
      query: (id) => `/movies/${id}`,
      providesTags: (result, error, id) => [{ type: 'Movies', id }],
    }),
    addMovie: builder.mutation<Movie, Omit<Movie, 'id'>>({
      query: (body) => ({
        url: '/movies',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Movies', id: 'LIST' }],
    }),
    updateMovie: builder.mutation<Movie, { id: number | string; data: Partial<Movie> }>({
      query: ({ id, data }) => ({
        url: `/movies/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Movies', id },
        { type: 'Movies', id: 'LIST' },
      ],
    }),
    deleteMovie: builder.mutation<{ success: boolean; id: number | string }, number | string>({
      query: (id) => ({
        url: `/movies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Movies', id },
        { type: 'Movies', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetMovieQuery,
  useAddMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} = moviesApi;