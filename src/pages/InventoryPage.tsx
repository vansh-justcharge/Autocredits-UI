import React, { useState, useEffect } from "react";
import { Search, Bell, User, LogOut } from 'lucide-react';
import { carsAPI } from "../services/api";
import type { Car } from "../services/api";
import AddCar from "./AddCar";
import EditCarModal from "./EditCarModal";
import ViewCarModal from "./ViewCarModal";
import Navbar from "./Navbar";

const ITEMS_PER_PAGE = 10;

const InventoryPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCar, setShowAddCar] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletePopup, setDeletePopup] = useState<{ show: boolean; id: string | null }>({ show: false, id: null });
  const [logoutPopup, setLogoutPopup] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch cars from the backend
  const fetchCars = async () => {
    try {
      const response = await carsAPI.getCars();
      if (response && Array.isArray(response.data)) {
        setCars(response.data);
      } else {
        setCars([]);
      }
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Filter and sort cars based on search and filters
  const filteredAndSortedCars = React.useMemo(() => {
    const filtered = cars.filter((car) => {
      const matchesSearch = searchQuery === "" || car.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = filterBrand === "" || (car.Brand?.toLowerCase() === filterBrand.toLowerCase());
      const matchesStatus = filterStatus === "" || (car.status?.toLowerCase() === filterStatus.toLowerCase());
      const matchesColor = filterColor === "" || (car.color?.toLowerCase().includes(filterColor.toLowerCase()));
      const matchesPrice =
        priceRange === "" ||
        (priceRange === "low" && car.price < 1000000) ||
        (priceRange === "medium" && car.price >= 1000000 && car.price < 5000000) ||
        (priceRange === "high" && car.price >= 5000000);

      return matchesSearch && matchesBrand && matchesStatus && matchesColor && matchesPrice;
    });

    filtered.sort((a, b) => a.customerName.localeCompare(b.customerName));
    return filtered;
  }, [cars, searchQuery, filterBrand, filterStatus, filterColor, priceRange]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedCars.length / ITEMS_PER_PAGE);
  const paginatedCars = filteredAndSortedCars.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterBrand, filterStatus, filterColor, priceRange]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Modal and CRUD handlers (unchanged)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const handleAddCar = async (carData: Omit<Car, "id">) => {
    try {
      const response = await carsAPI.createCar(carData);
      setCars([...cars, response.data]);
      setShowAddCar(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add car");
    }
  };

  const handleEditCar = async (id: string, carData: Car) => {
    try {
      const response = await carsAPI.updateCar(id, carData);
      setCars(cars.map((car) => (car._id === id ? response.data : car)));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update car");
    }
  };

  const handleDeleteCar = async (id: string | null) => {
    if (!id) return;
    try {
      await carsAPI.deleteCar(id);
      setCars(cars.filter((car) => car._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete car");
    }
  };

  const handleViewDetails = (car: Car) => {
    setSelectedCar(car);
    setIsViewModalOpen(true);
  };

  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setIsEditModalOpen(true);
  };

  const handleUpdateCar = async (updatedCar: Car) => {
    try {
      await carsAPI.updateCar(updatedCar._id, updatedCar);
      fetchCars();
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update car");
    }
  };

  const handleDeletePopup = async () => {
    await handleDeleteCar(deletePopup.id);
    setDeletePopup({ show: false, id: null });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar
        title="Inventory Management System"
        tabs={[]} 
        activeTab="" 
        setActiveTab={() => {}} 
      />
      <div className="max-w-7xl mx-auto p-6">
        {/* Controls Row */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded w-full sm:w-auto"
              onClick={() => setShowAddCar(true)}
            >
              Add New Car
            </button>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 outline-none"
              disabled
              title="Sorting is always by name"
            >
              Sort by Name
            </button>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Brands</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes">Mercedes</option>
              <option value="Audi">Audi</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Colors</option>
              <option value="black">Black</option>
              <option value="white">White</option>
              <option value="silver">Silver</option>
              <option value="red">Red</option>
              <option value="blue">Blue</option>
              <option value="gray">Gray</option>
            </select>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Prices</option>
              <option value="low">Under ₹10L</option>
              <option value="medium">₹10L - ₹50L</option>
              <option value="high">Over ₹50L</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredAndSortedCars.length} of {cars.length} cars
          {searchQuery && <span className="ml-2">for "{searchQuery}"</span>}
        </div>
        {/* Modals */}
        {showAddCar && (
          <AddCar isOpen={showAddCar} onClose={() => setShowAddCar(false)} onCarAdded={fetchCars} />
        )}
        {isEditModalOpen && selectedCar && (
          <EditCarModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            car={selectedCar}
            onUpdate={handleUpdateCar}
          />
        )}
        {isViewModalOpen && selectedCar && (
          <ViewCarModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} car={selectedCar} />
        )}
        {/* Table */}
        <div className="bg-white shadow overflow-x-auto sm:rounded-lg mt-6">
          <table className="min-w-[700px] sm:min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Number</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCars.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery || filterBrand || filterStatus || filterColor || priceRange
                      ? "No cars match your search criteria"
                      : "No cars found"}
                  </td>
                </tr>
              ) : (
                paginatedCars.map((car) => (
                  <tr key={car._id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {car.customerName}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.Brand}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.carNumber}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.model}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.year}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{car.price ? car.price.toLocaleString("en-IN") : "N/A"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{car.condition || "Good"}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          car.status === "available"
                            ? "bg-green-100 text-green-800"
                            : car.status === "sold"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {car.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          onClick={() => handleViewDetails(car)}
                        >
                          View
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          onClick={() => handleEdit(car)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
                          onClick={() => setDeletePopup({ show: true, id: car._id })}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-1 py-2 mt-4">
          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedCars.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            {" "}
            to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedCars.length)} of {filteredAndSortedCars.length} entries
          </div>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-2 py-2 text-gray-700 text-sm">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Last
            </button>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Popup */}
      {deletePopup.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs mx-2 text-center">
            <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                onClick={() => setDeletePopup({ show: false, id: null })}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDeletePopup}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Logout Confirmation Popup */}
      {logoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs mx-2 text-center">
            <h2 className="text-lg font-bold mb-3">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                onClick={() => setLogoutPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
