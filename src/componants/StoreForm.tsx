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
    if (name.trim().length > 0 && name.trim().length < 3) {
      setStoreNameError("Store name must be at least 3 characters long");
      return false;
    }
    setStoreNameError("");
    return true;
  };

  const validateEmail = (emailValue: string): boolean => {
    if (emailValue.trim().length === 0) {
      setEmailError("");
      return true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError("Invalid email format!");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setStoreName(newName);
    if (newName.trim().length > 0) {
      validateStoreName(newName);
    } else {
      setStoreNameError("");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail.trim().length > 0) {
      validateEmail(newEmail);
    } else {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    if (email.trim().length > 0) {
      validateEmail(email);
    }
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
        const result = await response.json();

        const taken = result?.data?.taken;

        if (taken) {
          setDomainStatus("taken");
          setDomainMessage("Not Available Domain. Re-enter!");
        } else {
          setDomainStatus("available");
          setDomainMessage("Domain is available!");
        }
      } catch (error) {
        setDomainStatus("taken");
        setDomainMessage("Error checking domain. Please try again.");
        console.error("Domain check failed:", error);
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

    if (!isStoreNameValid || !isEmailValid || !isDomainReady) return;

    const storeData = {
      name: storeName,
      currency,
      country: location,
      domain: debouncedDomain,
      category,
      email,
    };

    console.log("Submitting storeData:", storeData);

    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://interview-task-green.vercel.app/task/stores/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(storeData),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to create store.";
        try {
          const errorData = await response.json();
          if (errorData?.message) errorMessage = errorData.message;
        } catch {
          errorMessage = `Store creation failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      alert("Store created successfully! Redirecting...");
      router.push("/Products");
    } catch (error) {
      console.error("Store creation failed:", error);
      alert(
        `Error: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (error?: string, success?: boolean) => {
    const Suffix = "block w-full rounded-md shadow-sm sm:text-sm p-2.5 ";
    if (error)
      return `${Suffix}border-red-500 border focus:border-red-500 focus:ring-red-500`;
    if (success)
      return `${Suffix}border-green-500 border focus:border-green-500 focus:ring-green-500`;
    return `${Suffix}border-gray-300 border focus:border-indigo-500 focus:ring-indigo-500`;
  };

  const getDomainInputBorderClass = () => {
    if (domainStatus === "taken")
      return "border-red-500 focus-within:border-red-500 focus-within:ring-red-500";
    if (domainStatus === "available")
      return "border-green-500 focus-within:border-green-500 focus-within:ring-green-500";
    return "border-gray-300 focus-within:border-indigo-500 focus-within:ring-indigo-500";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Store Name Input */}
      <div className="flex items-start justify-between space-x-6">
        <div className="w-2/5">
          <div className="flex items-start space-x-3">
            <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <label
                htmlFor="storeName"
                className="block text-sm font-semibold text-gray-800"
              >
                Give your online store a name
              </label>
              <p className="mt-1 text-xs text-gray-500">
                A great store name is a big part of your success. Make sure it
                aligns with your brand and products.
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <input
            type="text"
            id="storeName"
            value={storeName}
            onChange={handleStoreNameChange}
            onBlur={() => validateStoreName(storeName)}
            placeholder="How'd you like to call your store?"
            className={`${getInputClass(
              storeNameError
            )} text-gray-900 dark:text-black`}
            required
            minLength={3}
          />
          {storeNameError && (
            <p className="mt-1 text-xs text-red-600">{storeNameError}</p>
          )}
        </div>
      </div>

      {/* Domain Input */}
      <div className="flex items-start justify-between space-x-6">
        <div className="w-2/5">
          <div className="flex items-start space-x-3">
            <LinkIcon className="h-6 w-6 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <label
                htmlFor="domain"
                className="block text-sm font-semibold text-gray-800"
              >
                Your online store subdomain
              </label>
              <p className="mt-1 text-xs text-gray-500">
                A SEO-friendly store name is a crucial part of your success.
                Make sure it aligns with your brand and products.
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <div
            className={`flex items-center rounded-md shadow-sm border focus-within:ring-1 ${getDomainInputBorderClass()}`}
          >
            <input
              type="text"
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="enter your domain name"
              className="block w-full rounded-l-md border-0 p-2.5 text-gray-900 ring-0 focus:ring-0 sm:text-sm flex-grow"
              required
            />
            <span className="inline-flex items-center rounded-r-md border-0 bg-gray-100 px-3 py-2.5 text-sm text-gray-500">
              .expressitbd.com
            </span>
          </div>
          {domainMessage && (
            <p
              className={`mt-1 text-xs ${
                domainStatus === "taken" ||
                (domainStatus === "idle" && domainMessage)
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
      <div className="flex items-start justify-between space-x-6">
        <div className="w-2/5">
          <div className="flex items-start space-x-3">
            <MapPinIcon className="h-6 w-6 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-gray-800"
              >
                Where&apos;s your store located?
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Set your store&apos;s default location so we can optimize store
                access and speed for your customers.
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={getInputClass()}
          >
            <option>Bangladesh</option>
          </select>
        </div>
      </div>

      {/* Category */}
      <div className="flex items-start justify-between space-x-6">
        <div className="w-2/5">
          <div className="flex items-start space-x-3">
            <TagIcon className="h-6 w-6 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-800"
              >
                What&apos;s your Category?
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Set your store&apos;s default category so that we can optimize
                store access and speed for your customers.
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <select
            id="category"
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
      <div className="flex items-start justify-between space-x-6">
        <div className="w-2/5">
          <div className="flex items-start space-x-3">
            <CurrencyDollarIcon className="h-6 w-6 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-semibold text-gray-800"
              >
                Choose store currency
              </label>
              <p className="mt-1 text-xs text-gray-500">
                This is the main currency you wish to sell in.
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={getInputClass()}
          >
            <option value="BDT">BDT (Taka)</option>
          </select>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start justify-between space-x-6">
        <div className="w-2/5">
          <div className="flex items-start space-x-3">
            <EnvelopeIcon className="h-6 w-6 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800"
              >
                Store contact email
              </label>
              <p className="mt-1 text-xs text-gray-500">
                This is the email you&apos;ll use to send notifications to and
                receive orders from customers.
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/5">
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            placeholder="you@example.com"
            className={`${getInputClass(
              storeNameError
            )} text-gray-900 dark:text-black`}
            required
          />
          {emailError && (
            <p className="mt-1 text-xs text-red-600">{emailError}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting || domainStatus === "checking"}
          className="rounded-md bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create store"}
        </button>
      </div>
    </form>
  );
}
