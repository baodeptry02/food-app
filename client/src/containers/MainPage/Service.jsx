import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import Edit from "../../animations/Edit.json";
import DarkEdit from "../../animations/DarkEdit.json";
import axios from "axios";

const Service = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvinceID, setSelectedProvinceID] = useState("");
  const [selectedDistrictID, setSelectedDistrictID] = useState("");
  const [selectedWardID, setSelectedWardID] = useState("");
  const [addressData, setAddressData] = useState(null);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
        {
          headers: {
            token: "33d08723-a497-11ef-bfcf-9e83397c467a",
          },
        }
      );
      const data = response.data.data;
      setProvinces(data);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvinceID) {
      const fetchDistricts = async () => {
        const response = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${selectedProvinceID}`,
          {
            headers: {
              token: "33d08723-a497-11ef-bfcf-9e83397c467a",
            },
          }
        );
        const data = response.data.data;
        setDistricts(data);
      };
      fetchDistricts();
    }
  }, [selectedProvinceID]);

  useEffect(() => {
    if (selectedDistrictID) {
      const fetchWards = async () => {
        const response = await axios.get(
          `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${selectedDistrictID}`,
          {
            headers: {
              token: "33d08723-a497-11ef-bfcf-9e83397c467a",
            },
          }
        );
        const data = response.data.data;
        setWards(data);
      };
      fetchWards();
    }
  }, [selectedDistrictID]);

  const handleFind = async () => {
    try {
      const provinceName = provinces.find(
        (prov) => prov.ProvinceID == selectedProvinceID
      )?.ProvinceName;

      const districtName = districts
        .find((dist) => dist.DistrictID == selectedDistrictID)
        ?.DistrictName.replace(/^Quận\s|^Huyện\s|^Thành phố\s/i, "");

      const wardName = wards
        .find((ward) => ward.WardCode === selectedWardID)
        ?.WardName.replace(/^Phường\s|^Xã\s|^Thị trấn\s/i, "");

      const encodedProvince = encodeURIComponent(provinceName);
      const encodedDistrict = encodeURIComponent(districtName);
      const encodedWard = encodeURIComponent(wardName);

      console.log("Encoded:", encodedProvince, encodedDistrict, encodedWard);

      const url = `https://cors-anywhere.herokuapp.com/https://services.giaohangtietkiem.vn/services/address/getAddressLevel4?province=${encodedProvince}&district=${encodedDistrict}&ward_street=${encodedWard}`;
      console.log("URL:", url);
      const response = await axios.get(`${url}`, {
        headers: {
          token: "76duRlamPHwHVcouzoetZaFm9vGqQF4RR8mTXq",
        },
      });
      setAddressData(response.data);
    } catch (error) {
      console.error("Error fetching address data:", error);
    }
  };

  return (
    <div>
      <section className="h-screen">
        <Lottie
          className="cursor-pointer w-16 h-16"
          animationData={isDarkMode ? DarkEdit : Edit}
          loop={true}
          autoplay={true}
        />
      </section>
      <section className="h-screen">
        <select
          onChange={(e) => {
            setSelectedProvinceID(e.target.value);
          }}
          value={selectedProvinceID}
        >
          <option value="">Select Province</option>
          {provinces.map((province) => (
            <option key={province.ProvinceID} value={province.ProvinceID}>
              {province.ProvinceName}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            setSelectedDistrictID(e.target.value);
          }}
          value={selectedDistrictID}
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district.DistrictID} value={district.DistrictID}>
              {district.DistrictName}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            setSelectedWardID(e.target.value);
          }}
          value={selectedWardID}
        >
          <option value="">Select Ward</option>
          {wards.map((ward) => (
            <option key={ward.WardCode} value={ward.WardCode}>
              {ward.WardName}
            </option>
          ))}
        </select>

        <button
          onClick={handleFind}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Find
        </button>

        {addressData && (
          <div className="mt-4">
            <h2>Address Data:</h2>
            <pre>{JSON.stringify(addressData, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
};

export default Service;
