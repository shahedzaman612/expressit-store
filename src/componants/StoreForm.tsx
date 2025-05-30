"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import {
  ChatBubbleLeftEllipsisIcon,
  LinkIcon,
  MapPinIcon,
  TagIcon,
  CurrencyDollarIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

type DomainStatus = "idle" | "checking" | "available" | "taken";

export default function StoreForm() {
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Fashion");
  const [location, setLocation] = useState("Bangladesh");
  const [currency, setCurrency] = useState("BDT");

  const [storeNameError, setStoreNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [domainStatus, setDomainStatus] = useState<DomainStatus>("idle");
  const [domainMessage, setDomainMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedDomain = useDebounce(domain, 500);

  const validateStoreName = (name: string): boolean => {
    if (name.trim().length < 3) {
      setStoreNameError("Store name must be at least 3 characters");
      return false;
    }
    setStoreNameError("");
    return true;
  };

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  };

  useEffect(() => {
    if (!debouncedDomain.trim()) {
      setDomainStatus("idle");
      setDomainMessage("");
      return;
    }

    const checkDomain = async () => {
      setDomainStatus("checking");
      setDomainMessage("Checking...");
      try {
        const response = await fetch(
          `https://interview-task-green.vercel.app/task/domains/check/${debouncedDomain}.expressitbd.com`
        );
        const data = await response.json();
        if (data.taken) {
          setDomainStatus("taken");
          setDomainMessage("Not available. Please re-enter.");
        } else {
          setDomainStatus("available");
          setDomainMessage("Domain is available!");
        }
      } catch {
        setDomainStatus("taken");
        setDomainMessage("Error checking domain. Try again.");
      }
    };

    checkDomain();
  }, [debouncedDomain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isStoreNameValid = validateStoreName(storeName);
    const isEmailValid = validateEmail(email);
    const isDomainReady =
      domainStatus === "available" && debouncedDomain.trim().length > 0;

    if (!isDomainReady && debouncedDomain.trim().length === 0) {
      setDomainStatus("taken");
      setDomainMessage("Domain cannot be empty.");
    }

    if (!isStoreNameValid || !isEmailValid || !isDomainReady) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        "https://interview-task-green.vercel.app/task/stores/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: storeName,
            currency,
            country: location,
            domain: debouncedDomain,
            category,
            email,
          }),
        }
      );

      if (!res.ok) throw new Error((await res.json()).message);

      alert("Store created successfully! Redirecting...");
      router.push("/Products");
    } catch (err: any) {
      alert("Error: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (error?: string, success?: boolean) => {
    const base = "block w-full rounded-md shadow-sm sm:text-sm p-2.5 ";
    if (error)
      return base + "border-red-500 focus:ring-red-500 focus:border-red-500";
    if (success)
      return (
        base + "border-green-500 focus:ring-green-500 focus:border-green-500"
      );
    return base + "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Store Name */}
      <div className="flex justify-between gap-6">
        <div className="w-2/5">
          <label className="font-semibold text-gray-800 flex items-center gap-2">
            <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-indigo-600" />
            Store Name
          </label>
          <p className="text-xs text-gray-500 mt-1">
            A great name boosts your brand&apos;s identity.
          </p>
        </div>
        <div className="w-3/5">
          <input
            type="text"
            placeholder="Your store name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            onBlur={() => validateStoreName(storeName)}
            className={getInputClass(storeNameError)}
            required
          />
          {storeNameError && (
            <p className="mt-1 text-xs text-red-600">{storeNameError}</p>
          )}
        </div>
      </div>

      {/* Domain */}
      <div className="flex justify-between gap-6">
        <div className="w-2/5">
          <label className="font-semibold text-gray-800 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-indigo-600" />
            Domain
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Your store&apos;s unique subdomain.
          </p>
        </div>
        <div className="w-3/5">
          <div
            className={`flex border rounded-md overflow-hidden ${
              domainStatus === "taken"
                ? "border-red-500"
                : domainStatus === "available"
                ? "border-green-500"
                : "border-gray-300"
            }`}
          >
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="flex-grow p-2 text-sm"
              required
            />
            <span className="px-3 py-2 text-sm bg-gray-100 text-gray-600">
              .expressitbd.com
            </span>
          </div>
          {domainMessage && (
            <p
              className={`mt-1 text-xs ${
                domainStatus === "taken"
                  ? "text-red-600"
                  : domainStatus === "available"
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {domainMessage}
            </p>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="flex justify-between gap-6">
        <div className="w-2/5">
          <label className="font-semibold text-gray-800 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-indigo-600" />
            Location
          </label>
        </div>
        <div className="w-3/5">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={getInputClass()}
          >
            <option>Bangladesh</option>
          </select>
        </div>
      </div>

      {/* Category */}
      <div className="flex justify-between gap-6">
        <div className="w-2/5">
          <label className="font-semibold text-gray-800 flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-indigo-600" />
            Category
          </label>
        </div>
        <div className="w-3/5">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={getInputClass()}
          >
            <option>Fashion</option>
            <option>Electronics</option>
            <option>Groceries</option>
          </select>
        </div>
      </div>

      {/* Currency */}
      <div className="flex justify-between gap-6">
        <div className="w-2/5">
          <label className="font-semibold text-gray-800 flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5 text-indigo-600" />
            Currency
          </label>
        </div>
        <div className="w-3/5">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={getInputClass()}
          >
            <option value="BDT">BDT (৳ Taka)</option>
          </select>
        </div>
      </div>

      {/* Email */}
      <div className="flex justify-between gap-6">
        <div className="w-2/5">
          <label className="font-semibold text-gray-800 flex items-center gap-2">
            <EnvelopeIcon className="w-5 h-5 text-indigo-600" />
            Contact Email
          </label>
        </div>
        <div className="w-3/5">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email)}
            className={getInputClass(emailError)}
            required
          />
          {emailError && (
            <p className="mt-1 text-xs text-red-600">{emailError}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || domainStatus === "checking"}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Store"}
        </button>
      </div>
    </form>
  );
}
