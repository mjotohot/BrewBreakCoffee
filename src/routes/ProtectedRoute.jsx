// import { Outlet } from 'react-router'
// import { useAuthStore } from '../stores/useAuthStore'

// const ProtectedRoute = () => {
//   const { user, isLoading } = useAuthStore() // Access auth state from the store

//   // Show loading spinner while checking auth status
//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gray-100">
//         <div className="flex flex-col items-center">
//           <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
//           <p className="text-gray-700 text-lg font-medium">
//             Checking your session...
//           </p>
//         </div>
//       </div>
//     )
//   }

//   if (!user) {
//     // User is not logged in / forbidden
//     return (
//       <div className="flex h-screen flex-col items-center justify-center bg-gray-100 text-center px-4">
//         <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
//         <p className="text-gray-700 mb-6">
//           You do not have permission to access this page. Please login to
//           continue.
//         </p>
//         <button
//           onClick={() => (window.location.href = '/login')}
//           className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 cursor-pointer"
//         >
//           Go to Login
//         </button>
//       </div>
//     )
//   }

//   return <Outlet />
// }

// export default ProtectedRoute
